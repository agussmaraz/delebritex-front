<template>
    <div>
       <v-container-fluid>
           <v-row>
               <v-card>
                   <v-img :src="producto.imagen"></v-img>
               </v-card>
           </v-row>
       </v-container-fluid>
    </div>
</template>

<script>
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
    };
</script>

<style></style>
