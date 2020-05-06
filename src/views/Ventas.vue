<template>
    <div class="container">
        <h1>hola</h1>
        <table class="table table-hover crud-ventas">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Accion</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in movimientos" :key="index">
                    <td>{{ resetearFecha(item.fecha) }}</td>
                    <td>{{ item.producto.nombre }}</td>
                    <td>{{ item.valor }}</td>
                    <td>{{ item.accion }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                movimientos: [],
            };
        },
        created() {
            this.listarMovimientos();
        },
        methods: {
            listarMovimientos() {
                this.axios.get('/movimientos').then((res) => {
                    this.movimientos = res.data;
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style>
    .crud-ventas {
        width: 80%;
        margin: 0 auto;
        border: 1px solid#dee2e6;
    }
</style>
