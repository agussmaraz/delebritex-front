<template>
    <div class="margin">
        <v-app>
            <h1 class="mt-5">Venta Presencial</h1>
            <div class="d-flex justify-content-around mt-5 caja-presencial">
                <div class="caja-productos">
                    <listaProductos />
                </div>
                <div>
                    <carrito-admin />
                </div>
            </div>
        </v-app>
    </div>
</template>
<script>
    import listaProductos from '@/components/listaProductos.vue';
    import carritoAdmin from '../components/carritoAdmin.vue';
    export default {
        components: {
            listaProductos: listaProductos,
            carritoAdmin: carritoAdmin,
        },
    };
</script>

<style lang="scss">
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
    .caja-presencial {
        @media screen and (max-width: 550px) {
            display: flex;
            flex-flow: column;
            margin: 0 auto;
        }
    }
    .caja-productos {
        @media screen and (max-width: 550px) {
            margin: 0 auto;
            margin-bottom: 20px;
        }
    }
</style>
