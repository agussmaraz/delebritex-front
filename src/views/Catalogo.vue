<template>
    <v-app class="margin" ref="layout">
        <div class="container catalogo">
            <v-app-bar color="grey darken-3 white--text">
                <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <v-toolbar-title>Nuestros productos</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <paginate name="prod_filtered" :list="filtro" :per="9" :container="this">
                <v-row>
                    <v-card v-for="(item, index) in paginated('prod_filtered')" :key="index" class="texto-card m-3" max-width="300" max-height="400" @click="conseguirProducto(item)">
                        <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                        <v-card-title class="text-capitalize">{{ item.nombre }}</v-card-title>
                        <v-card-text class="text--primary">
                            <div>Whitsunday Island, Whitsunday Islands</div>
                            <div>${{ item.precioUnidad }}</div>
                        </v-card-text>
                    </v-card>
                </v-row>
            </paginate>
            <paginate-links for="prod_filtered" :limit="changePaginate()" :show-step-links="true" :step-links="{ next: '   ', prev: ' ' }" :container="{ state: paginate.prod_filtered, el: $refs.layout }"></paginate-links>
            <v-navigation-drawer v-model="drawer" absolute temporary>
                <v-list-item>
                    <v-list-item-content>
                        <div class="d-flex">
                            <v-text-field v-model="producto" @keyup="buscarProducto()" @keyup.delete="getProducts()" label="Buscar"> </v-text-field>
                        </div>
                    </v-list-item-content>

                    <v-list-item-avatar>
                        <v-icon class="fas fa-search"></v-icon>
                    </v-list-item-avatar>
                </v-list-item>

                <v-divider></v-divider>

                <v-list>
                    <v-treeview v-model="selection" return-object selectable selected-color="green" activatable shaped rounded open-on-click :items="items"> </v-treeview>
                    <p v-for="node in selection" :key="node.id">
                        {{ node.name }}
                    </p>
                </v-list>
            </v-navigation-drawer>
            <v-dialog v-model="dialog" max-width="700" class="mobile">
                <v-card class="mx-auto" height="600" width="700" outlined>
                    <v-img :src="this.productoId.imagen" width="665" height="250" class="m-3 img-margin"></v-img>
                       <v-list-item three-line class="space-buttons"> 
                        <v-list-item-content>
                            <v-list-item-title class="headline">{{ this.productoId.nombre }}</v-list-item-title>
                            <div class=" sm-1">
                                <h5>Precio por unidad: ${{ this.productoId.precioUnidad }}</h5>
                                <h5>Precio paquetes: ${{ this.productoId.precioBulto }}</h5>
                                <small> Unidades por paquetes: {{ this.productoId.unidadPorEmpaque }} </small>
                                <v-divider class="mx-4" vertical></v-divider>
                                <small>Stock unidades: {{ this.productoId.totalUnidad }}</small>
                                <v-divider class="mx-4" vertical></v-divider>
                                <small class="ml-2">Paquetes en stock: {{ this.paquetes }}</small>
                            </div>
                        </v-list-item-content>
                    </v-list-item>

                    <v-card-actions class="d-flex justify-content-around sm-2 mb-2 size">
                        <div class="d-flex sm-1">
                            <div>
                                <div>
                                <p v-if="error" class=" catalogo-error">
                                    {{ this.error.unidades }}
                                </p>
                                </div>
                                Unidades
                                <div>
                                    <v-btn small @click="aumentarCantidad()">+ </v-btn>
                                    {{ cantidades }}
                                    <v-btn small @click="restarCantidad()"> -</v-btn>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p v-if="error" class=" catalogo-error">
                                    {{ this.error.paquetes }}
                                </p>
                                Paquetes
                                <div>
                                    <v-btn small class="ml-5" @click="aumentarCantidadPaquete()">+ </v-btn>
                                    {{ cantidadPaquete }}
                                    <v-btn small @click="restarCantidadPaquete()"> -</v-btn>
                                </div>
                            </div>
                            <v-divider></v-divider>
                        </div>
                    </v-card-actions>
                    <v-btn class="text-center button" @click="agregarAlCarrito()">
                        Añadir al carrito
                    </v-btn>
                </v-card>
            </v-dialog>
        </div>
    </v-app>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                paginate: ['prod_filtered'],
                drawer: null,
                productoId: '',
                dialog: false,
                cantidades: 0,
                cantidadPaquete: 0,
                paquetes: '',
                producto: '',
                categorias: '',
                selection: [],
                error: {},
                selectionType: 'leaf',
                items: [
                    {
                        id: 1,
                        name: 'Categorias :',
                        children: [],
                    },
                ],
            };
        },
        computed: {
            ...mapState({
                productos: (state) => state.productos.productos,
                carrito: (state) => state.carritos.carrito,
                filtro: (state) => state.productos.filtro.productos,
            }),
        },
        methods: {
            ...mapActions({
                getProducts: 'productos/getProducts',
                addToCart: 'carritos/addToCart',
                removeFromCart: 'carritos/removeFromCart',
                findProduct: 'productos/findProduct',
            }),
            calcularPaquetes(element) {
                const empaques = Number(element.totalUnidad) / Number(element.unidadPorEmpaque);
                this.paquetes = Math.ceil(empaques);
            },
            changePaginate() {
                if (window.screen.width >= 420) {
                    return 5;
                } else {
                    return 3;
                }
            },
            // buscar el producto que selecciono el usuario en vuex
            conseguirProducto(item) {
                this.error = {};
                this.cantidadPaquete = 0;
                this.cantidades = 0;
                this.dialog = true;
                const id = item.id;
                for (let index = 0; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    if (element.id == id) {
                        this.productoId = element;
                        this.calcularPaquetes(element);
                    }
                }
            },
            // agregar al carrito el producto que fue seleccionado con las cantidades elegidas.
            agregarAlCarrito() {
                if (this.cantidades > 0 || this.cantidadPaquete > 0) {
                    this.productoId.cantidadElegida = this.cantidades;
                    this.productoId.paquetesElegidos = this.cantidadPaquete;
                    this.addToCart(this.productoId);
                    localStorage.setItem('carrito', JSON.stringify(this.carrito));
                    this.dialog = false;
                    this.cantidades = 0;
                    this.cantidadPaquete = 0;
                    this.error = {};
                }
            },
            // suma las cantidades que quiere el usuario
            aumentarCantidad() {
                this.cantidades++;
                if (this.cantidades > this.productoId.totalUnidad) {
                    this.error.unidades = 'No hay esa cantidad de unidades';
                    this.cantidades = this.productoId.totalUnidad;
                }
            },
            aumentarCantidadPaquete() {
                this.cantidadPaquete++;
                if (this.cantidadPaquete > this.paquetes) {
                    this.error.paquetes = 'No hay esa cantidad de paquetes';
                    this.cantidadPaquete = this.paquetes;
                }
            },
            restarCantidadPaquete() {
                this.cantidadPaquete--;
                if (this.cantidadPaquete <= 0) {
                    this.cantidadPaquete = 0;
                }
                if (this.cantidadPaquete < this.paquetes) {
                    this.error.paquetes = '';
                }
            },
            // resta las cantidades que quiere el usuario
            restarCantidad() {
                this.cantidades--;
                if (this.cantidades <= 0) {
                    this.cantidades = 0;
                }
                if (this.cantidades < this.productoId.totalUnidad) {
                    this.error.unidades = '';
                }
            },
            buscarProducto() {
                this.findProduct(this.producto);
            },
        },
        beforeMount() {
            this.getProducts();
            // this.conseguirCategorias();
        },
    };
</script>

<style lang="scss">
    .img-margin{
        margin: 1rem !important;
        @media screen and (max-width: 430px) {
           margin: 0 !important;
        }
    }

    .space-buttons{
        margin-bottom: 1rem !important;
    }

    .catalogo-error {
        font-size: 13px;
        color: red;
        position: absolute;
        margin-top: -1.6rem !important;
         @media screen and (max-width: 430px) {
           margin-top: -2rem!important;
        }
    }
    
    .card {
        width: 250px;
    }

    .row {
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

    .ml {
        margin-left: 0 auto !important;
    }

    .paginate-links {
        width: 100%;
        list-style: none;
        display: flex;
        justify-content: center;
        text-align: center;
        align-content: center;
        @media screen and (max-width: 1265px) {
            margin-left: -5%;
        }
    }
    .paginate-links li.number {
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }

    .paginate-links li.right-arrow {
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }

    .paginate-links li.left-arrow {
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }

    .paginate-links li.left-arrow a::before {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        content: '\f100';
    }

    .paginate-links li.right-arrow a::before {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        content: '\f101';
    }

    .paginate-links li.left-arrow.disabled a {
        color: #bdbdbd !important;
    }

    .paginate-links li.number.active {
        background-color: #424242;
    }

    .paginate-links li.number.active a {
        color: white;
    }

    .paginate-links li.ellipses {
        margin-left: 2%;
        margin-top: 0.5%;
        font-weight: bold;
    }

    .v-application a {
        color: black;
    }
</style>
