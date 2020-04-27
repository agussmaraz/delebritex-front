<template>
    <article class="container productos">
        <h1>Productos</h1>
        <table class="table table-hover crud">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Productos</th>
                    <th scope="col">Medida</th>
                    <th scope="col">Total unidades</th>
                    <th scope="col"> Paquetes</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in producto" :key="index">
                    <td>{{ formatearFecha(item.createdAt) }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.medida['medida'] }}</td>
                    <td>{{ item.totalUnidad }}</td>
                    <td>{{item.cantidadPaquetes}} </td>
                    <td>
                        <button type="button" class="btn btn-danger ">Eliminar</button>
                        <button type="button" class="btn btn-warning button-crud">Editar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </article>
</template>

<script>
    export default {
        data() {
            return {
                producto: [],
            };
        },
        created() {
            this.listarProducto();
        },
        methods: {
            listarProducto() {
                this.axios.get('/producto').then((res) => {
                    this.producto = res.data;
                });
            },
            formatearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style>
.productos{
    margin: 10%;
}

.crud {   
  border: 1px solid#dee2e6;
  margin: 2em;
}

.button-crud {
  margin-left: 10px;    
}
</style>
