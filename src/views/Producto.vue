<template>
<v-container-fluid>
    <v-card 
    max-height="100%"
    max-width="100%"
    >
        <!-- <h1>{{ this.$route.params.slug}}</h1>
        <p>stock: {{ producto.totalUnidad }}</p> -->
        <v-img class="white--text align-end" height="700px" width="auto" :src="producto.imagen" :contain="true"> </v-img>
        <v-card-title>{{ producto.nombre }}</v-card-title>
        <v-card-text class="text--primary">
        <div>{{producto.precioUnidad}}</div>
        <div>{{ producto.totalUnidad }}</div>
        </v-card-text>
        <v-card-actions>
        <v-btn class="text-center" to="#" @click="addToCart(producto)">
        Añadir al carrito
        </v-btn>
        </v-card-actions>
        </v-card>
    </v-card>
</v-container-fluid>
</template>

<script>
 import { mapState, mapGetters, mapActions } from 'vuex';
    export default {    
        data() {
            return {
                productoSlug: this.$route.params.slug,
                producto: [],
                publicPath: process.env.BASE_URL,
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
                removeFromCart: 'removeFromCart'
            }),
        },
    };
</script>

<style>
</style>
