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
                                            <v-text-field v-model="productoEditar.empaques" label="Paquetes"></v-text-field>
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
                <template v-slot:[`item.actions`]="{ item }">
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
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                headers: [
                    { text: 'Fecha', value: 'createdAt' },
                    { text: 'Actualizacion', value: 'updatedAt' },
                    { text: 'Producto', value: 'nombre' },
                    { text: 'Total Unidades', value: 'totalUnidad' },
                    { text: 'Paquetes', value: 'empaque' },
                    { text: 'Precio Unidad', value: 'precioUnidad' },
                    { text: 'Precio Bulto', value: 'precioBulto' },
                    { text: 'Acciones', value: 'actions', sortable: false },
                ],
                producto: [],
                productoEditar: [],
                dialog: false,
                dialog2: false,
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
            };
        },
        methods: {
            ...mapActions({
                getProducts: 'productos/getProducts',
            }),
            // Transformar la fecha en DD-MM-YYYY
            formatearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            // Funcion para eliminar el producto
            eliminarProducto(id) {
                this.axios.delete(`/eliminarProducto/${id}`).then((res) => {
                    const index = this.productos.findIndex((item) => Number(item.id) == Number(res.data));
                    this.productos.splice(index, 1);
                    this.mensaje.texto = 'El producto fue eliminado correctamente';
                    this.mensaje.color = 'success';
                    this.showAlert();
                });
            },
            // Trar el producto segun el id y guardarlo en un dato
            editarProductoId(item) {
                const id = item.id;
                this.dialog = true;
                this.productoEditar = item;
                this.productoEditar.empaques = Math.ceil(this.empaques(this.productoEditar));
            },
            // Para cerrar ventanita de edicion
            cancelarEdicion(id) {
                this.dialog = false;
            },
            // Editar el producto
            editarProducto(item) {
                this.calcularEmpaques(this.productoEditar);
                this.axios.put(`/editarProducto/${item.id}`, item).then((res) => {
                    const index = this.productos.findIndex((index) => index.id === this.productoEditar.id);
                    this.productos[index].nombre = this.productoEditar.nombre;
                    this.productos[index].totalUnidad = this.productoEditar.totalUnidad;
                    this.productos[index].pesoUnidad = this.productoEditar.pesoUnidad;
                    this.productos[index].precioUnidad = this.productoEditar.precioUnidad;
                    this.productos[index].precioBulto = this.productoEditar.precioBulto;
                    this.productoEditar = {};
                    this.dialog = false;
                });
            },
            actualizarStock() {
                this.dialog2 = true;
            },
            calcularEmpaques(item) {
                const empaques = item.empaques;
                const unidadPorEmpaque = item.unidadPorEmpaque;

                item.totalUnidad = Number(empaques) * Number(unidadPorEmpaque);
                item.empaque = empaques + ' cajas';
            },
            empaques(item) {
                const unidades = item.totalUnidad;
                const unidadPorEmpaque = item.unidadPorEmpaque;
                return Number(unidades) / Number(unidadPorEmpaque);
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
            ...mapState({
                productos: (state) => state.productos.productos,
            }),
            // Transformar los productos en un array para acceder a los datos y transformarlo en un crud.
            obtenerProductos() {
                return this.productos.map((producto) => {
                    producto.createdAt = this.formatearFecha(producto.createdAt);
                    producto.updatedAt = this.formatearFecha(producto.updatedAt);
                    if (producto.empaque.nombre == 'caja') {
                        producto.empaque = Math.ceil(this.empaques(producto)) + ' cajas';
                    } else if (producto.empaque.nombre == 'unidad') {
                        producto.empaque = producto.totalUnidad + ' unidades';
                    }
                    return producto;
                });
            },
        },
        beforeMount() {
            this.getProducts();
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
