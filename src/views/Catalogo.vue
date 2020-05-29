<template>
    <div class="container catalogo">
        <v-app class="margin">
            <v-row>
                <div class="d-flex">
                    <v-text-field v-model="producto" @keyup="buscarProducto()" @keyup.delete="getProducts()" label="Buscar"> </v-text-field>
                </div>
            </v-row>
            <v-row>
                <v-card v-for="(item, index) in filtro" :key="index" class="texto-card m-3" max-width="300" max-height="350" @click="conseguirProducto(item)">
                    <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                    <v-card-title class="text-capitalize">{{ item.nombre }}</v-card-title>
                    <v-card-text class="text--primary">
                        <div>Whitsunday Island, Whitsunday Islands</div>
                        <div>${{ item.precioUnidad }}</div>
                    </v-card-text>
                </v-card>
            </v-row>
            <template>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <paginate ref="paginator" name="comida" :list="comida" :per="5">
                                <p v-for="string in paginated('comida')" :key="string.id">{{ string }}</p>
                            </paginate>
                            <!-- <paginate-links
                                for="arrayStrings"
                                :show-step-links="true"
                                :simple="{
                                    prev: 'Anterior',
                                    next: 'Siguiente',
                                }"
                            ></paginate-links> -->
                        </div>
                    </div>
                </div>
            </template>

            <v-dialog v-model="dialog" max-width="650">
                <v-card class="mx-auto" height="400" outlined>
                    <v-list-item three-line>
                        <v-img :src="this.productoId.imagen" width="70" height="280" class="m-3"> </v-img>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-1">{{ this.productoId.nombre }}</v-list-item-title>
                            <div class="d-flex justify-content-around">
                                <h4>Precio: ${{ this.productoId.precioUnidad }}</h4>
                                <h4>Stock: {{ this.productoId.totalUnidad }}</h4>
                            </div>
                        </v-list-item-content>
                    </v-list-item>

                    <v-card-actions class="justify-content-center">
                        <v-btn class="text-center button" to="#" @click="agregarAlCarrito()">
                            Añadir al carrito
                        </v-btn>
                        <div class="ml-7">
                            <v-btn @click="aumentarCantidad()">+ </v-btn>
                            {{ cantidades }}
                            <v-btn @click="restarCantidad()"> -</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-app>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                productoId: '',
                dialog: false,
                cantidades: 0,
                producto: '',
                comida: ['milanesa', 'hambuerguesa', 'pizza'],
                paginate: ['comida'],
            };
        },
        computed: {
            ...mapState({
                productos: (state) => state.productos,
                carrito: (state) => state.carrito,
                filtro: (state) => state.filtro.productos,
            }),
        },
        methods: {
            ...mapActions({
                getProducts: 'getProducts',
                addToCart: 'addToCart',
                removeFromCart: 'removeFromCart',
                findProduct: 'findProduct',
            }),
            // buscar el producto que selecciono el usuario en vuex
            conseguirProducto(item) {
                this.dialog = true;
                const id = item.id;
                for (let index = 0; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    if (element.id == id) {
                        this.productoId = element;
                    }
                }
            },
            // agregar al carrito el producto que fue seleccionado con las cantidades elegidas.
            agregarAlCarrito() {
                if (this.cantidades > 0) {
                    this.productoId.cantidadElegida = this.cantidades;
                    this.addToCart(this.productoId);
                    this.dialog = false;
                    this.cantidades = 0;
                }
            },
            // suma las cantidades que quiere el usuario
            aumentarCantidad() {
                this.cantidades++;
            },
            // resta las cantidades que quiere el usuario
            restarCantidad() {
                this.cantidades--;
                if (this.cantidades <= 0) {
                    this.cantidades = 0;
                }
            },
            buscarProducto() {
                this.findProduct(this.producto);
            },
        },
        beforeMount() {
            this.getProducts();
        },
    };
</script>

<style lang="scss">
    .card {
        width: 250px;
    }
    .row {
        width: 100% !important;
        justify-content: center;
    }
    .catalogo {
        margin-top: 2%;
    }
    .card-position {
        margin: 1.5%;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.19) !important;
        max-width: 20rem;
        @media screen and (max-width: 680px) {
            margin: 6%;
        }
    }
    .contenedor {
        max-width: 1455px !important;
        margin: 0 auto;
    }
    .center {
        text-align: center !important;
    }
    .texto-card {
        text-decoration: none !important;
    }
    .texto-card:hover {
        border: 1px solid rgb(199, 195, 195) !important;
    }
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
</style>
