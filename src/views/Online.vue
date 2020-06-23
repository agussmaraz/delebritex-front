<template>
    <div>
        {{ productosPorCarrito }}
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    export default {
        data() {
            return {};
        },
        methods: {
            ...mapActions({
                getCarritos: 'carritos/getAll',
            }),
        },
        computed: {
            ...mapGetters({
                productosPorCarrito: 'carritos/productosPorCarrito',
            }),
            ...mapState({
                carritos: (state) => state.carritos.lista,
            }),
        },
        async beforeMount() {
            await this.getCarritos();
        },
    };
</script>

<style></style>
