<template>
    <article class="container productos">
        <h1>Productos</h1>
        <form @submit.prevent="editarProducto(productoEditar)" class="form-editar" v-if="editar">
            <article class="form-editar-flex">
                <div>
                    <div class="form-group">
                        <label>Producto</label>
                        <input type="text" class="form-control" v-model="productoEditar.nombre" />
                    </div>
                    <div class="form-group">
                        <label>Total unidades</label>
                        <input type="number" class="form-control" v-model="productoEditar.totalUnidad" />
                    </div>
                </div>
                <div class="parteDos-formEditar">
                    <div class="form-group">
                        <label>Paquetes</label>
                        <input type="number" class="form-control" v-model="productoEditar.cantidadPaquetes" />
                    </div>
                    <div class="form-group">
                        <label>Peso por unidad</label>
                        <input type="number" class="form-control" v-model="productoEditar.pesoUnidad" />
                    </div>
                </div>
            </article>
            <button type="submit" class="btn btn-success">Enviar</button>
            <button type="submit" class="btn bg-secondary button-crud" @click="cancelarEdicion()">Cancelar</button>
        </form>
        <table class="table table-hover crud">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Productos</th>
                    <th scope="col">Medida</th>
                    <th scope="col">Total unidades</th>
                    <th scope="col">Paquetes</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in producto" :key="index">
                    <td>{{ formatearFecha(item.createdAt) }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.medida['medida'] }}</td>
                    <td>
                        <button @click="restarCantidad(item, item.id)">-</button>
                        {{ item.totalUnidad }}
                        <button @click="aumentarCantidad(item, item.id)">+</button>
                    </td>
                    <td>{{ cantidadPaquetes(item) }}</td>
                    <td>
                        <button type="button" class="btn btn-danger" @click="eliminarProducto(item.id)">Eliminar</button>
                        <button type="button" class="btn btn-warning button-crud" @click="editarProductoId(item.id)">Editar</button>
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
                productoEditar: [],
                editar: false,
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
            aumentarCantidad(item, id) {
                this.axios.put(`/editarProducto/${id}`, { totalUnidad: item.totalUnidad + 1 }).then((res) => {
                    item.totalUnidad++;
                });
            },
            restarCantidad(item, id) {
                this.axios.put(`/editarProducto/${id}`, { totalUnidad: item.totalUnidad - 1 }).then((res) => {
                    item.totalUnidad--;
                });
            },
            eliminarProducto(id) {
                console.log(id);
                this.axios.delete(`/eliminarProducto/${id}`).then((res) => {
                    let index = this.producto.findIndex((item) => item._id === res.data._id);
                    this.producto.splice(index, 1);
                });
            },
            editarProductoId(id) {
                this.editar = true;
                this.axios.get(`/producto/${id}`).then((res) => {
                    this.productoEditar = res.data;
                });
            },
            cancelarEdicion(id) {
                this.editar = false;
            },
            editarProducto(item) {
                console.log(item);
                this.axios.put(`/editarProducto/${item.id}`, item).then((res) => {
                    const index = this.producto.findIndex((index) => index._id === this.productoEditar._id);
                    this.producto[index].nombre = this.productoEditar.nombre;
                    this.producto[index].cantidadPaquetes = this.productoEditar.cantidadPaquetes;
                    this.producto[index].totalUnidad = this.productoEditar.totalUnidad;
                    this.producto[index].pesoUnidad = this.productoEditar.pesoUnidad;
                    this.productoEditar = {};
                });
            },
            cantidadPaquetes(item) {
                if (item.empaqueId == '1') {
                    const paquetes = item.totalUnidad / item.unidadPorEmpaque;
                    return Math.ceil(paquetes);
                } else if (item.empaqueId == '2') {
                    const paquetePorUnidad = 0;
                    return Math.ceil(paquetePorUnidad);
                }
            },
        },
    };
</script>

<style>
    .crud {
        border: 1px solid#dee2e6;
        margin: 2em;
    }

    .button-crud {
        margin-left: 10px;
        color: white;
    }
    .form-editar-flex {
        display: flex;
        justify-content: center;
    }
    .parteDos-formEditar {
        margin-left: 20px;
    }
</style>
