<template>
    <v-app>
        <div>
            <v-card width="400" height="400" style="max-height: 400px" class="overflow-y-auto" outlined>
                <div class="cabecera">
                    <h5>Carrito</h5>
                </div>
                <p v-if="carritoAdmin.length == 0">Para hacer una compra, elige los productos y las cantidades!</p>
                <v-list-item class="caja-carrito" v-for="(item, index) in carritoAdmin" :key="index" three-line>
                    <v-list-item-content>
                        <div class="text-capitalize font-weight-bold">
                            {{ item.producto }}
                        </div>
                        <div class="d-flex ">
                            <v-list-item-subtitle v-if="item.unidades > 0"> Unidades: {{ item.unidades }} </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="item.empaques > 0">
                                Bultos: {{ item.empaques }}
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span class="tooltip-unidad" v-on="on">i</span>
                                    </template>
                                    <span>Unidades por bulto: {{ item.unidadPorEmpaque }}</span>
                                </v-tooltip>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle> Total: ${{ calcularPrecio(item) }} <v-icon small @click="editarPrecio(item)">mdi-pencil</v-icon> <v-icon small @click="removeItemFromCartAdmin(item)">mdi-delete</v-icon></v-list-item-subtitle>
                        </div>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <h3 class="mt-3">Total: ${{ sumaPrecio(this.carritoAdmin) }}</h3>
            <div class="d-flex justify-content-around">
                <v-btn @click="removeCartAdmin()">Vaciar carrito</v-btn>
                <v-btn color="success" @click="verificarCompra()">Terminar compra</v-btn>
            </div>
            <div>
                <v-row justify="center">
                    <v-dialog v-model="dialog2" max-width="290">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ this.dataEditar.producto }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-if="dataEditar.empaques > 0" v-model="dataEditar.precioBulto" label="Precio Bulto" required></v-text-field>
                                            <v-text-field v-if="dataEditar.unidades > 0" v-model="dataEditar.precioUnidad" label="Precio Unidad" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <div class="d-flex justify-content-around">
                                    <v-btn small @click="cancelarCambios(dataEditar)">Cancelar</v-btn>
                                    <v-btn small color="success" @click="guardarCambios(dataEditar)">Guardar</v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-row>
            </div>
        </div>
    </v-app>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
        name: 'carritoAdmin',
        data() {
            return {
                dialog2: false,
                precioBulto: 0,
                precioUnidad: 0,
                dataEditar: '',
            };
        },
        computed: {
            ...mapState({
                productos: (state) => state.productos,
                filtro: (state) => state.filtro.productos,
                carritoAdmin: (state) => state.carritoAdmin,
            }),
        },
        methods: {
            ...mapActions({
                findProduct: 'findProduct',
                addCartAdmin: 'addCartAdmin',
                removeCartAdmin: 'removeCartAdmin',
                removeQuantity: 'removeQuantity',
                removeItemFromCartAdmin: 'removeItemFromCartAdmin',
            }),
            editarPrecio(item) {
                this.dialog2 = true;
                this.precioBulto = item.precioBulto;
                this.precioUnidad = item.precioUnidad;
                this.dataEditar = item;
            },
            calcularPrecio(item) {
                const totalPaquetes = Number(item.empaques) * Number(item.precioBulto);
                const totalUnidades = Number(item.unidades) * Number(item.precioUnidad);
                return Number(totalPaquetes) + Number(totalUnidades);
            },
            sumaPrecio(item) {
                return item.reduce((total, item) => total + Number(this.calcularPrecio(item)), 0);
            },
            verificarCompra() {
                for (let index = 0; index < this.carritoAdmin.length; index++) {
                    const element = this.carritoAdmin[index];
                    element.precioTotal = this.calcularPrecio(element);
                }
                let payload = {};
                payload.productos = this.carritoAdmin;

                this.axios.post('/movimiento', payload).then((res) => {
                    this.sacarCantidadesDB();
                    this.removeCartAdmin();
                });
            },
            sacarCantidadesDB() {
                for (let index = 0; index < this.carritoAdmin.length; index++) {
                    const element = this.carritoAdmin[index];
                    this.removeQuantity(element);
                    const id = element.id;
                    this.axios.put(`/stock/${id}`, this.carritoAdmin).then((res) => {
                        console.log(res.data);
                    });
                }
            },
            guardarCambios() {
                this.dialog2 = false;
            },
            cancelarCambios(data) {
                if (data.precioBulto !== this.precioBulto || data.precioUnidad !== this.precioUnidad) {
                    data.precioBulto = this.precioBulto;
                    data.precioUnidad = this.precioUnidad;
                }
                this.dialog2 = false;
            },
        },
    };
</script>

<style>
    .tooltip-unidad {
        border: solid gray 1px;
        padding: 5px;
        border-radius: 10px;
        background-color: gray;
        color: white;
        margin-left: 4px;
    }
    .cabecera {
        background-color: rgb(121, 117, 117);
        color: white;
        padding: 10px;
    }
    .caja-carrito {
        border-bottom: 1px solid rgb(207, 205, 205);
    }
</style>
