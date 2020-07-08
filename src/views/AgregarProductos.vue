<template>
    <div class="agregarProductos margin">
        <h1>Agregar nuevos productos</h1>
        <template>
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <v-form enctype="multipart/form-data" class="formProducto" data-app>
                <template>
                    <v-row class="form-margin">
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.nombre" label="Nombre del producto" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.nombre }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-select label="Medida" v-model="producto.medidaId" :items="medida"> </v-select>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-select label="Empaque" v-model="producto.empaqueId" :items="empaque"></v-select>
                            <p v-if="error" class=" p-error">
                                {{ this.error.empaqueId }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6" v-if="producto.empaqueId == 'caja'">
                            <v-text-field v-model="producto.cantidadPaquetes" label="Cantidad de paquetes"></v-text-field>
                        </v-col>
                        <v-col cols="5" md="6" v-if="this.producto.empaqueId == 'caja'">
                            <v-text-field v-model="producto.unidadPorEmpaque" label="Unidades por paquetes" required></v-text-field>
                            <p>El total de unidades son: {{ totalUnidadesPorPaquete }}</p>
                            <p v-if="error" class=" p-error">
                                {{ this.error.unidadPorEmpaque }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6" v-else>
                            <v-text-field v-model="producto.unidadPorEmpaque" label="Unidades" required></v-text-field>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.pesoUnidad" label="Peso por unidad" required></v-text-field>
                            <p>El peso total es de: {{ totalPeso }}</p>
                            <p v-if="error" class=" p-error">
                                {{ this.error.pesoUnidad }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-select label="Categoria" v-model="producto.categoriaId" :items="categoria"></v-select>
                            <p v-if="error" class=" p-error">
                                {{ this.error.categoriaId }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioUnidad" label="Precio unidad para cliente" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioUnidad }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioBulto" label="Precio bulto para cliente" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioBulto }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioDistribuidoraUnidad" label="Precio unidad compra" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioDistribuidoraUnidad }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioDistribuidoraBulto" label="Precio bulto compra" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioDistribuidoraBulto }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-file-input multiple label="File input" @change="imagenSeleccionada"></v-file-input>
                            <p v-if="error" class=" p-error">
                                {{ this.error.imagen }}
                            </p>
                        </v-col>
                    </v-row>

                    <input @click.prevent="nuevoProducto()" type="submit" value="Enviar" />
                </template>
            </v-form>
        </template>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                producto: {
                    nombre: '',
                    totalUnidad: '',
                    empaqueId: '',
                    medidaId: '',
                    pesoUnidad: '',
                    unidadPorEmpaque: '',
                    categoriaId: '',
                    slug: '',
                    imagen: '',
                    precioUnidad: '',
                    precioBulto: '',
                    precioDistribuidoraUnidad: '',
                    precioDistribuidoraBulto: '',
                },
                path: '',
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
                error: {},
            };
        },
        computed: {
            ...mapState({
                medida: (state) => state.productos.medida,
                categoria: (state) => state.productos.categorias,
                empaque: (state) => state.productos.empaques,
            }),
            totalUnidadesPorPaquete() {
                if (this.producto.empaqueId == 'caja') {
                    const totalUnidadPorEmpaque = Number(this.producto.cantidadPaquetes) * Number(this.producto.unidadPorEmpaque);
                    return totalUnidadPorEmpaque;
                }
            },
            totalUnidades() {
                if (this.producto.empaqueId == 'unidad') {
                    const totalUnidades = this.producto.unidadPorEmpaque;
                    return totalUnidades;
                }
            },
            totalPeso() {
                if (this.producto.empaqueId == 'caja') {
                    const totalPeso = this.totalUnidadesPorPaquete * this.producto.pesoUnidad;
                    return totalPeso;
                } else {
                    const totalPesoPorUnidad = this.producto.unidadPorEmpaque * this.producto.pesoUnidad;
                    return totalPesoPorUnidad;
                }
            },
        },

        methods: {
            ...mapActions({
                listarMedidas: 'productos/listarMedidas',
                listarBultos: 'productos/listarBultos',
                listarCategorias: 'productos/listarCategorias',
                newProduct: 'productos/newProduct',
            }),
            // Conseguir la data de la imagen
            imagenSeleccionada(e) {
                const files = e[0];
                this.producto.imagen = files;
            },
            // Validar le formulario, recorriendo con un for todas las posicion para saber si estan vacias.
            validacionProducto() {
                this.error = {};
                const productos = Object.entries(this.producto);
                for (let index = 0; index < productos.length; index++) {
                    const element = productos[index];
                    if (!element[1]) {
                        const posicion = element[0];
                        const mensaje = 'El ' + posicion + ' no puede estar vacio';
                        this.error[posicion] = mensaje;
                    }
                }
                if (!this.error) {
                    return true;
                }
            },
            // Crear un objeto con los datos del formulario y mandarselo a la base de datos
            async nuevoProducto() {
                this.validacionProducto();

                if (this.totalUnidadesPorPaquete) {
                    this.producto.totalUnidad = this.totalUnidadesPorPaquete;
                } else if (!this.totalUnidadesPorPaquete) {
                    this.producto.totalUnidad = this.totalUnidades;
                }
                this.producto.slug = this.producto.nombre;
                const formulario = new FormData();
                formulario.set('medidaId', this.producto.medidaId == 'kg' ? 2 : 3);
                formulario.set('empaqueId', this.producto.empaqueId == 'caja' ? 1 : 2);
                formulario.set('categoriaId', this.producto.categoriaId == 'hola' ? 2 : 3);
                formulario.set('pesoUnidad', this.producto.pesoUnidad);
                formulario.set('unidadPorEmpaque', this.producto.unidadPorEmpaque);
                formulario.set('nombre', this.producto.nombre);
                formulario.set('totalUnidad', this.producto.totalUnidad);
                formulario.set('slug', this.producto.slug);
                formulario.set('imagen', this.producto.imagen);
                formulario.set('precioUnidad', this.producto.precioUnidad);
                formulario.set('precioBulto', this.producto.precioBulto);
                formulario.set('precioDistribuidoraUnidad', this.producto.precioDistribuidoraUnidad);
                formulario.set('precioDistribuidoraBulto', this.producto.precioDistribuidoraBulto);

                await this.newProduct(formulario);

                const producto = Object.entries(this.producto);
                for (let index = 0; index < producto.length; index++) {
                    const element = producto[index];
                    element[1] = '';
                }

                this.showAlert();
            },
            // funciones de alert de bootstrap
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
        beforeMount() {
            this.listarMedidas();
            this.listarBultos();
            this.listarCategorias();
        },
    };
</script>

<style lang="scss">
    .form-margin {
        margin-left: -50px !important;
        margin-right: -100px !important;
    }
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
    .agregarProductos {
        margin: 20px;
    }

    .formProducto {
        width: 60%;
        margin: 0 auto;
    }
    .input-form {
        width: 250px;
        margin: 0 auto;
    }

    .article-flex {
        display: flex;
        justify-content: center;
    }

    .empaque {
        margin-left: 20px;
    }

    select {
        width: 100px;
    }
    .p-error {
        color: red;
    }
</style>
