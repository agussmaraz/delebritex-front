<template>
    <div v-if="carritoAdmin.length > 0">
        <v-card width="300" style="max-height: 400px" class="overflow-y-auto" outlined>
            <h5>Carrito</h5>
            <v-list-item v-for="(item, index) in carritoAdmin" :key="index" three-line>
                <v-list-item-content>
                    <div class="text-capitalize font-weight-bold">
                        {{ item.producto }}
                    </div>
                    <div class="d-flex">
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
                        <v-list-item-subtitle> Total: ${{ calcularPrecio(item) }} <v-icon small @click="editarPrecio(item)">mdi-pencil</v-icon> </v-list-item-subtitle>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
        <h3 class="mt-3">Total: ${{ sumaPrecio(this.carritoAdmin) }}</h3>
        <v-btn @click="verificarCompra()">Terminar compra</v-btn>
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
                                        <v-text-field v-if="dataEditar.totalUnidad > 0" v-model="dataEditar.precioUnidad" label="Precio Unidad" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-btn @click="cancelarCambios(dataEditar)">Cancelar</v-btn>
                            <v-btn @click="guardarCambios(dataEditar)">Guardar</v-btn>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>
    </div>
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
                    this.removeCartAdmin();
                });
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
</style>
