<template>
    <div>
        <h1>{{ this.$route.params.slug}}</h1>
        <p>stock: {{ producto.totalUnidad }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                productoSlug: this.$route.params.slug,
                producto: [],
            };
        },
        computed: {
            traerProducto() {
                const slug = this.productoSlug;
                this.axios.get(`/producto/${slug}`).then((res) => {
                    if (res.data.slug == this.productoSlug) {
                        this.producto = res.data;
                        console.log(this.producto);
                    }
                });
            },
        },
    };
</script>

<style></style>
