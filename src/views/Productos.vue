<template>
    <article class="container productos" data-app>
        <h1>Productos</h1>
        <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>

        <template>
            <v-data-table :headers="headers" :items="obtenerProductos" :items-per-page="5" class="elevation-1">
                <template v-slot:top>
                    <v-dialog v-model="dialog" width="500">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo producto</v-btn>
                        </template>
                        <v-card>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.nombre" label="Nombre"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.empaqueId" label="Paquetes"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.totalUnidad" label="Total unidades"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.pesoUnidad" label="Peso por unidad"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.precioUnidad" label="Precio Unidad"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="productoEditar.precioBulto" label="Precio Bulto"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="cancelarEdicion()">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="editarProducto(productoEditar)">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editarProductoId(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="eliminarProducto(item.id)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </template>
    </article>
</template>

<script>
    export default {
        data() {
            return {
                headers: [
                    { text: 'Fecha', value: 'createdAt' },
                    { text: 'Producto', value: 'nombre' },
                    { text: 'Medida', value: 'medidaId' },
                    { text: 'Total Unidades', value: 'totalUnidad' },
                    { text: 'Paquetes', value: 'empaqueId' },
                    { text: 'Precio Unidad', value: 'precioUnidad' },
                    { text: 'Precio Bulto', value: 'precioBulto' },
                    { text: 'Acciones', value: 'actions', sortable: false },
                ],
                producto: [],
                productoEditar: [],
                dialog: false,
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
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
            // aumentarCantidad(item, id) {
            //     console.log(item);
            //     this.axios.put(`/editarProducto/${id}`, { totalUnidad: Number(item.totalUnidad) + 1 }).then((res) => {
            //         item.totalUnidad++;
            //     });
            // },
            // restarCantidad(item, id) {
            //     console.log(id);
            //     this.axios.put(`/editarProducto/${id}`, { totalUnidad: Number(item.totalUnidad) - 1 }).then((res) => {
            //         item.totalUnidad--;
            //     });
            // },
            eliminarProducto(id) {
                this.axios.delete(`/eliminarProducto/${id}`).then((res) => {
                    console.log(res.data);
                    const index = this.producto.findIndex((item) => Number(item.id) == Number(res.data));
                    this.producto.splice(index, 1);
                    this.mensaje.texto = 'El producto fue eliminado correctamente';
                    this.mensaje.color = 'success';
                    this.showAlert();
                });
            },
            editarProductoId(item) {
                const id = item.id;
                this.dialog = true;
                this.axios.get(`/producto/${id}`).then((res) => {
                    // console.log(res.data);
                    this.productoEditar = res.data;
                });
            },
            cancelarEdicion(id) {
                this.dialog = false;
            },
            editarProducto(item) {
                console.log(item);
                this.axios.put(`/editarProducto/${item.id}`, item).then((res) => {
                    const index = this.producto.findIndex((index) => index.id === this.productoEditar.id);
                    this.producto[index].nombre = this.productoEditar.nombre;
                    this.producto[index].cantidadPaquetes = this.productoEditar.cantidadPaquetes;
                    this.producto[index].totalUnidad = this.productoEditar.totalUnidad;
                    this.producto[index].pesoUnidad = this.productoEditar.pesoUnidad;
                    this.producto[index].precioUnidad = this.productoEditar.precioUnidad;
                    this.producto[index].precioBulto = this.productoEditar.precioBulto;
                    this.productoEditar = {};
                    this.dialog = false;
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
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
        computed: {
            obtenerProductos() {
                return this.producto.map((producto) => {
                    producto.createdAt = this.formatearFecha(producto.createdAt);
                    return producto;
                });
            },
        },
    };
</script>

<style>
    .productos {
        margin-top: 3%;
    }
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
