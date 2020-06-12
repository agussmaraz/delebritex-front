<template>
    <div class="margin">
        <v-app>
            <h1 class="mt-5">Venta Presencial</h1>
            <div class="d-flex justify-content-around mt-5">
                <div>
                    <v-card class="p-2" width="300" tile>
                        <h5>Productos</h5>
                        <v-text-field @keyup="buscarProducto()" @keyup.delete="getProducts()" v-model="busqueda" label="Buscar"> </v-text-field>
                        <v-list style="max-height: 300px" class="overflow-y-auto" rounded>
                            <v-list-item-group color="primary">
                                <v-list-item v-for="(item, i) in filtro" :key="i" @click="elegirProducto(item)">
                                    <v-list-item-subtitle class="text-capitalize">{{ item.nombre }} </v-list-item-subtitle>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card>
                </div>
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
                                    <v-list-item-subtitle v-if="item.bultos > 0">
                                        Bultos: {{ item.bultos }}
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
                </div>
            </div>
            <template>
                <v-row justify="center">
                    <v-dialog v-model="dialog2" max-width="290">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ this.precio.producto }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-if="precio.bultos > 0" v-model="precio.precioBulto" label="Precio Bulto" required></v-text-field>
                                            <v-text-field v-if="precio.unidades > 0" v-model="precio.precioUnidad" label="Precio Unidad" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-btn @click="guardarCambios(precio)">Guardar</v-btn>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-row>
            </template>
            <template>
                <v-row justify="center">
                    <v-dialog v-model="dialog" max-width="290">
                        <v-card>
                            <v-card-title class="headline text-capitalize">{{ this.productoElegido.nombre }}</v-card-title>
                            <v-card-text>
                                <v-list-item-subtitle> Unidades: {{ this.productoElegido.totalUnidad }}</v-list-item-subtitle>
                                <v-list-item-subtitle> Bultos</v-list-item-subtitle>
                                <span> Las unidades por bulto son: {{ this.productoElegido.unidadPorEmpaque }} </span>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <div>
                                    Unidades
                                    <div>
                                        <v-btn small @click="aumentarUnidad()">+ </v-btn>
                                        {{ unidades }}
                                        <v-btn small @click="restarUnidad()"> -</v-btn>
                                    </div>
                                </div>
                                <div class="ml-5">
                                    Bultos
                                    <div>
                                        <v-btn small @click="aumentarBulto()">+ </v-btn>
                                        {{ bultos }}
                                        <v-btn small @click="restarBulto()"> -</v-btn>
                                    </div>
                                </div>
                            </v-card-actions>
                            <v-btn class="mt-2 mb-3" @click="agregarProducto()">Agregar</v-btn>
                        </v-card>
                    </v-dialog>
                </v-row>
            </template>
        </v-app>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                busqueda: '',
                dialog: false,
                dialog2: false,
                productoElegido: '',
                unidades: 0,
                bultos: 0,
                precio: '',
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
                getProducts: 'getProducts',
                findProduct: 'findProduct',
                addCartAdmin: 'addCartAdmin',
            }),
            buscarProducto() {
                this.findProduct(this.busqueda);
            },
            elegirProducto(item) {
                this.dialog = true;
                this.productoElegido = item;
                // console.log(item.nombre);
            },
            agregarProducto() {
                let buffer = {};
                buffer.producto = this.productoElegido.nombre;
                buffer.unidades = this.unidades;
                buffer.bultos = this.bultos;
                buffer.unidadPorEmpaque = this.productoElegido.unidadPorEmpaque;
                buffer.precioUnidad = this.productoElegido.precioUnidad;
                buffer.precioBulto = this.productoElegido.precioBulto;
                this.addCartAdmin(buffer);
                this.dialog = false;
                this.unidades = 0;
                this.bultos = 0;
            },
            calcularPrecio(item) {
                const totalPaquetes = Number(item.bultos) * Number(item.precioBulto);
                const totalUnidades = Number(item.unidades) * Number(item.precioUnidad);
                return Number(totalPaquetes) + Number(totalUnidades);
            },
            sumaPrecio(item) {
                return item.reduce((total, item) => total + Number(this.calcularPrecio(item)), 0);
            },
            editarPrecio(item) {
                this.dialog2 = true;
                this.precio = item;
            },
            guardarCambios() {
                this.dialog2 = false;
            },
            aumentarUnidad() {
                this.unidades++;
            },
            aumentarBulto() {
                this.bultos++;
            },
            restarUnidad() {
                this.unidades--;
            },
            restarBulto() {
                this.bultos--;
            },
        },
        beforeMount() {
            this.getProducts();
        },
    };
</script>

<style lang="scss">
    .buscador {
        width: 200px;
    }
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
    .tooltip-unidad {
        border: solid gray 1px;
        padding: 5px;
        border-radius: 10px;
        background-color: gray;
        color: white;
        margin-left: 4px;
    }
</style>
