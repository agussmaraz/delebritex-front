<template>
    <div class="catalogo">
        <div class="contenedor container">
            <div class="row">
                <b-card class="card mb-2 card-position" footer-tag="footer" img-src="https://i.picsum.photos/id/52/700/500.jpg" img-alt="Image" img-top tag="article" v-for="(item, index) in producto" :key="index">
                    <b-card-text>{{ item.nombre }} </b-card-text>
                    <router-link :to="{ name: 'productoSlug', params: {slug: item.slug} }"> Ver mas </router-link>
                    <template v-slot:footer>
                        <em>Footer Slot</em>
                    </template>
                </b-card>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                producto: [],
            };
        },
        created() {
            this.mostrar();
        },
        methods: {
            mostrar() {
                this.axios.get('/producto').then((res) => {
                    this.producto = res.data;
                });
            },
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
</style>
