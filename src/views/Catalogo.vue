<template>
    <div class="container catalogo">
        <v-app class="margin">
            <v-row>
                <v-card v-for="(item, index) in productos" :key="index" class="texto-card m-3"  max-width="300" max-height="350" :to="{ name: 'productoSlug', params: { slug: item.slug } }">
                    <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                    <v-card-title  class="text-capitalize">{{ item.nombre }}</v-card-title>
                    <v-card-text class="text--primary">
                        <div>Whitsunday Island, Whitsunday Islands</div>
                        <div>${{ item.precioUnidad }}</div>
                        <!-- <div>{{ item.totalUnidad }}</div> -->
                    </v-card-text>
                </v-card>
            </v-row>
        </v-app>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        computed: {
            ...mapState({
                productos: (state) => state.productos,
                carrito: (state) => state.carrito,
            }),
        },
        methods: {
            ...mapActions({
                getProducts: 'getProducts',
                addToCart: 'addToCart',
                removeFromCart: 'removeFromCart',
            }),
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
    .texto-card{
        text-decoration: none !important;
    }
    .texto-card:hover {
        border: 1px solid rgb(199, 195, 195) !important;
    }
    .margin{
        @media screen and (max-width: 990px) {
        margin-bottom: 40% !important;
    }
    }
</style>
