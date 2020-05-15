<template>
    <div class="catalogo">
        {{ carrito.length }}
        <v-container-fluid>
            <v-row>
                <v-card v-for="(item, index) in productos" :key="index" class="mx-auto margen" max-width="400" :to="{ name: 'productoSlug', params: { slug: item.slug } }">
                    <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                    <v-card-title>{{ item.nombre }}</v-card-title>
                    <v-card-text class="text--primary">
                        <div>Whitehaven Beach</div>
                        <div>Whitsunday Island, Whitsunday Islands</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="orange" text :to="{ name: 'productoSlug', params: { slug: item.slug } }">
                            Ver mas
                        </v-btn>
                        <v-btn color="orange" text to="#" @click="addToCart(item)">
                            Añadir al carrito
                        </v-btn>
                        <v-btn color="orange" text to="#" @click="removeFromCart()"> Vaciar carrito </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container-fluid>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
        created() {
            this.mostrar();
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
                removeFromCart: 'removeFromCart'
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
    .margen {
        margin: 5px 5px 5px 5px;
        text-decoration: none !important;
    }
</style>
