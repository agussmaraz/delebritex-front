<template>
    <article class="container productos margin" data-app>
        <h1>Stock de productos</h1>
        <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
        <template>
            <v-btn color="secondary" class="mb-5 d-flex justify-content-start" max-width="200" to="/agregarProductos"> + Nuevo producto</v-btn>
        </template>
        <template>
            <v-data-table :headers="headers" :items="obtenerProductos" :items-per-page="5" class="elevation-1">
                <template v-slot:top>
                    <v-dialog v-model="dialog" width="500">
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
                    { text: 'Medida', value: 'medida.medida' },
                    { text: 'Total Unidades', value: 'totalUnidad' },
                    { text: 'Paquetes', value: 'empaque.nombre' },
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
            //Traer productos de la base de datos
            listarProducto() {
                this.axios.get('/producto').then((res) => {
                    this.producto = res.data;
                });
            },
            // Transformar la fecha en DD-MM-YYYY
            formatearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            // Funcion para eliminar el producto
            eliminarProducto(id) {
                this.axios.delete(`/eliminarProducto/${id}`).then((res) => {
                    const index = this.producto.findIndex((item) => Number(item.id) == Number(res.data));
                    this.producto.splice(index, 1);
                    this.mensaje.texto = 'El producto fue eliminado correctamente';
                    this.mensaje.color = 'success';
                    this.showAlert();
                });
            },
            // Trar el producto segun el id y guardarlo en un dato
            editarProductoId(item) {
                const id = item.id;
                this.dialog = true;
                this.axios.get(`/producto/${id}`).then((res) => {
                    this.productoEditar = res.data;
                });
            },
            // Para cerrar ventanita de edicion
            cancelarEdicion(id) {
                this.dialog = false;
            },
            // Editar el producto
            editarProducto(item) {
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
            // Calcular la cantidad de paquetes
            cantidadPaquetes(item) {
                if (item.empaqueId == '1') {
                    const paquetes = item.totalUnidad / item.unidadPorEmpaque;
                    return Math.ceil(paquetes);
                } else if (item.empaqueId == '2') {
                    const paquetePorUnidad = 0;
                    return Math.ceil(paquetePorUnidad);
                }
            },
            // Funciones para el alert de bootstap
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
        computed: {
            // Transformar los productos en un array para acceder a los datos y transformarlo en un crud.
            obtenerProductos() {
                return this.producto.map((producto) => {
                    producto.createdAt = this.formatearFecha(producto.createdAt);
                    return producto;
                });
            },
        },
    };
</script>

<style lang="scss">
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
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 20% !important;
        }
    }
</style>
