<template>
    <v-app>
        <v-container>
            <v-container>
                <v-img src="/img/delebritex.jpeg" max-height="50%" max-width="auto%" contain position> </v-img>
            </v-container>
        </v-container>
        <v-spacer></v-spacer>
        <v-card class="spaceCard" dark>
            <v-toolbar flat>
                <v-toolbar-title class="center">Nuestros productos</v-toolbar-title>
            </v-toolbar>
        </v-card>
        <div v-if="this.productos.length >= 5">
            <v-carousel class="space">
                <v-carousel-item v-for="(item, i) in limitProduct()" :key="i" :src="item.imagen" reverse-transition="fade-transition" transition="fade-transition" to="/catalogo" show-arrows-on-hover cycle></v-carousel-item>
            </v-carousel>
        </div>
    </v-app>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
        data: () => ({
            length: 3,
            onboarding: 0,
            producto: '',
            productoId: '',
            colors: ['indigo', 'warning', 'pink darken-2', 'red lighten-1', 'deep-purple accent-4'],
            slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
            array: [],
        }),
        beforeMount() {
            this.getProducts();
            this.limitProduct();
        },

        computed: {
            ...mapState({
                productos: (state) => state.productos.productos,
                carrito: (state) => state.carritos.carrito,
            }),
        },
        methods: {
            ...mapActions({
                getProducts: 'productos/getProducts',
                addToCart: 'carrito/addToCart',
                removeFromCart: 'carrito/removeFromCart',
                findProduct: 'productos/findProduct',
            }),
            changePaginate() {
                if (window.screen.width >= 420) {
                    return 5;
                } else {
                    return 3;
                }
            },

            limitProduct() {
                const leng = this.productos.length - 5;
                const array = [];
                for (let index = leng; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    array.push(element);
                }
                return array;
            },
        },
    };
</script>
<style lang="scss">
    .space {
        margin-bottom: 20%;
    }
    .spaceCard {
        margin-bottom: 1%;
    }
</style>
