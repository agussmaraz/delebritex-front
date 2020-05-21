<template>
<v-container-fluid>
    <v-card 
    max-height="100%"
    max-width="100%"
    :outlined="true"
    :tile="true"
    >
        <!-- <h1>{{ this.$route.params.slug}}</h1>
        <p>stock: {{ producto.totalUnidad }}</p> -->
        <v-img class="white--text align-end" height="700px" width="auto" :src="producto.imagen" :contain="true"> </v-img>
        <v-divider></v-divider>
        <v-card-text>
        <div class="font-weight-bold font">{{ producto.nombre }}</div>
        <div class="font-weight-bold font2">${{producto.precioUnidad}}</div>
        <div>{{ producto.totalUnidad > 0 ? "En stock: " + producto.totalUnidad : "Sin stock."}}</div>
        </v-card-text>
        <v-btn class="text-center button" to="#" @click="addToCart(producto)">
        Añadir al carrito
        </v-btn>
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
.button{
    margin: 1rem !important;
}
.font{
    font-size: 2rem !important;
    margin: 1rem;
}
.font2{
    font-size: 3rem;
    margin: 2rem;
}
</style>
