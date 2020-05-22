<template>
    <div class="catalogo">
        <!-- {{ carrito.length }} -->
        <v-app>
            <v-row>
                <v-card v-for="(item, index) in productos" :key="index" class="mr-auto margen" max-width="400" :to="{ name: 'productoSlug', params: { slug: item.slug } }">
                    <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                    <v-card-title>{{ item.nombre }}</v-card-title>
                    <v-card-text class="text--primary">
                        <div>{{ item.precio }}</div>
                        <div>Whitsunday Island, Whitsunday Islands</div>
                        <div>{{ item.totalUnidad }}</div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn class="center" to="#" @click="addToCart(item)">
                            Añadir al carrito
                        </v-btn>
                       
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-app>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        data() {
            return {
                cantidades: 0,
            };
        },
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
            aumentarCantidad() {
                this.cantidades++;
                console.log(this.cantidades);
            },
            restarCantidad() {
                this.cantidades--;
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
    .margen {
        margin: 5px 5px 5px 5px;
        text-decoration: none !important;
    }
    .center {
        text-align: center !important;
    }
</style>
