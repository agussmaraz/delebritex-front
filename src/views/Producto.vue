<template>
    <div>
        <v-card max-height="100%" max-width="80%" class="producto-vista" :outlined="true" :tile="true">
            <v-img class="white--text align-end" height="200px" width="auto" :src="producto.imagen" :contain="true"> </v-img>
            <v-divider></v-divider>
            <v-card-text>
                <div class="font-weight-bold font">{{ producto.nombre }}</div>
                <div class="font-weight-bold font2">${{ producto.precioUnidad }}</div>
                <div>{{ producto.totalUnidad > 0 ? 'En stock: ' + producto.totalUnidad : 'Sin stock.' }}</div>

            </v-card-text>
            <v-card-actions class="justify-content-center">
                <v-btn class="text-center button" to="#" @click="productoSeleccionado(producto)">
                    Añadir al carrito
                </v-btn>
                <v-btn @click="aumentarCantidad()">+ </v-btn>
                {{ cantidades }}
                <v-btn @click="restarCantidad()"> -</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
        data() {
            return {
                productoSlug: this.$route.params.slug,
                producto: [],
                publicPath: process.env.BASE_URL,
                color: 'grey lighten-2',
                cantidades: 0,
                productoSeleccinado: '',
            };
        },
        computed: {
            traerProducto() {},
            ...mapState({
                productos: (state) => state.productos,
                carrito: (state) => state.carrito,
            }),
        },
        beforeMount() {
            const slug = this.productoSlug;
            this.axios.get(`/producto/nombre/${slug}`).then((res) => {
                if (res.data.slug == slug) {
                    this.producto = res.data;
                    console.log(this.producto);
                }
            });
        },
        methods: {
            ...mapActions({
                getProducts: 'getProducts',
                addToCart: 'addToCart',
                removeFromCart: 'removeFromCart',
            }),
            aumentarCantidad() {
                this.cantidades++;
                //guardar los datos de las cantidades en el carrito asi ya sabemos cuanto se compra.
            },
            restarCantidad() {
                this.cantidades--;
                if (this.cantidades <= 0) {
                    this.cantidades = 0;
                }
            },
            productoSeleccionado(producto) {
                if (this.cantidades > 0) {
                    producto.totalUnidad = this.cantidades;
                    this.addToCart(producto);
                }
            },
        },
    };
</script>

<style>
    .button {
        margin: 1rem !important;
    }
    .font {
        font-size: 2rem !important;
        margin: 1rem;
    }
    .font2 {
        font-size: 3rem;
        margin: 2rem;
    }
    .producto-vista {
        margin: 0 auto !important;
    }
    /* .buttons-producto {
        display: flex !important;
        margin: 0 auto;
    } */
</style>
