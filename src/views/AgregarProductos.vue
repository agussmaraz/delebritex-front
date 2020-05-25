<template>
    <div class="agregarProductos">
        <h1>Agregar nuevos productos</h1>

        <template class="container">
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <v-form @submit.prevent="nuevoProducto()" enctype="multipart/form-data" data-app>
                <v-container>
                    <v-row>
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
                            <v-text-field v-model="producto.precioUnidad" label="Precio unidad" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioUnidad }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioBulto" label="Precio bulto" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioBulto }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioDistribuidoraUnidad" label="Precio unidad distribuidora" required></v-text-field>
                            <p v-if="error" class=" p-error">
                                {{ this.error.precioDistribuidoraUnidad }}
                            </p>
                        </v-col>
                        <v-col cols="5" md="6">
                            <v-text-field v-model="producto.precioDistribuidoraBulto" label="Precio bulto distribuidora" required></v-text-field>
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
                    <v-btn color="secondary" type="submit">Enviar</v-btn>
                </v-container>
            </v-form>
        </template>
    </div>
</template>

<script>
    export default {
        computed: {
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
                medida: [],
                empaque: [],
                categoria: [],
                path: '',
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
                error: {},
            };
        },
        created() {
            this.listarMedida();
            this.listarEmpaque();
            this.listarCategoria();
        },
        methods: {
            imagenSeleccionada(e) {
                const files = e[0];
                this.producto.imagen = files;
            },
            nuevoProducto() {
                this.error = {};
                if (!this.producto.nombre) {
                    const nombre = 'El nombre es obligatorio';
                    this.error.nombre = nombre;
                }
                if (!this.producto.empaqueId) {
                    const empaque = 'El empaque es obligatorio';
                    this.error.empaqueId = empaque;
                }
                if (!this.producto.pesoUnidad) {
                    const peso = 'El peso es obligatorio';
                    this.error.pesoUnidad = peso;
                }
                if (this.producto.empaqueId == 'caja' && !this.producto.cantidadPaquetes) {
                    const cantidadPaquetes = 'La cantidad de paquetes es obligatorio';
                    this.error.cantidadPaquetes = cantidadPaquetes;
                }
                if (!this.producto.unidadPorEmpaque) {
                    const unidades = 'Las unidades es obligatorio';
                    this.error.unidadPorEmpaque = unidades;
                }
                if (!this.producto.categoriaId) {
                    const categoria = 'La categoria es obligatoria.';
                    this.error.categoriaId = categoria;
                }
                if (!this.producto.imagen) {
                    const imagen = 'La imagen es obligatoria.';
                    this.error.imagen = imagen;
                }
                if (!this.producto.precioUnidad) {
                    const precioUnidad = 'El precio de la unidad es obligatorio.';
                    this.error.precioUnidad = precioUnidad;
                }
                if (!this.producto.precioBulto) {
                    const precioBulto = 'El precio por bulto es obligatorio.';
                    this.error.precioBulto = precioBulto;
                }
                if (!this.producto.precioDistribuidoraUnidad) {
                    const precioDistribuidoraUnidad = 'El precio de la distribuidora es obligatorio.';
                    this.error.precioDistribuidoraUnidad = precioDistribuidoraUnidad;
                }
                if (!this.producto.precioDistribuidoraBulto) {
                    const precioDistribuidoraBulto = 'El precio de la distribuidora es obligatorio.';
                    this.error.precioDistribuidoraBulto = precioDistribuidoraBulto;
                }
                if (!this.error) {
                    return true;
                }

                if (this.totalUnidadesPorPaquete) {
                    this.producto.totalUnidad = this.totalUnidadesPorPaquete;
                } else if (!this.totalUnidadesPorPaquete) {
                    this.producto.totalUnidad = this.totalUnidades;
                }
                this.producto.slug = this.producto.nombre;
                const formulario = new FormData();
                formulario.set('nombre', this.producto.nombre);
                formulario.set('totalUnidad', this.producto.totalUnidad);
                if (this.producto.medidaId == 'kg') {
                    formulario.set('medidaId', 2);
                } else {
                    formulario.set('medidaId', 1);
                }
                if (this.producto.empaqueId == 'caja') {
                    formulario.set('empaqueId', 1);
                } else {
                    formulario.set('empaqueId', 2);
                }
                formulario.set('pesoUnidad', this.producto.pesoUnidad);
                formulario.set('unidadPorEmpaque', this.producto.unidadPorEmpaque);
                if (this.producto.categoriaId == 'hola') {
                    formulario.set('categoriaId', 2);
                } else {
                    formulario.set('categoriaId', 3);
                }
                formulario.set('slug', this.producto.slug);
                formulario.set('imagen', this.producto.imagen);
                formulario.set('precioUnidad', this.producto.precioUnidad);
                formulario.set('precioBulto', this.producto.precioBulto);
                formulario.set('precioDistribuidoraUnidad', this.producto.precioDistribuidoraUnidad);
                formulario.set('precioDistribuidoraBulto', this.producto.precioDistribuidoraBulto);
                this.axios.post('/nuevoProducto', formulario).then((res) => {
                    this.producto.nombre = '';
                    this.producto.medidaId = '';
                    this.producto.empaqueId = '';
                    this.producto.unidadPorEmpaque = '';
                    this.producto.pesoUnidad = '';
                    this.producto.categoriaId = '';
                    this.producto.precioUnidad = '';
                    this.producto.precioBulto = '';
                    this.producto.precioDistribuidoraUnidad = '';
                    this.producto.precioDistribuidoraBulto = '';

                    this.producto.imagen = '';
                    this.mensaje.texto = 'El producto fue agregado correctamente';
                    this.mensaje.color = 'success';
                    this.showAlert();
                });
            },
            listarMedida() {
                this.axios.get('/buscarMedida').then((res) => {
                    this.medida = res.data.map((medida) => {
                        return medida.medida;
                    });
                });
            },
            listarEmpaque() {
                this.axios.get('/empaqueBuscar').then((res) => {
                    this.empaque = res.data.map((empaque) => {
                        return empaque.nombre;
                    });
                });
            },
            listarCategoria() {
                this.axios.get('categoriaBuscar').then((res) => {
                    this.categoria = res.data.map((categoria) => {
                        return categoria.nombre;
                    });
                });
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
    };
</script>

<style>
    .agregarProductos {
        margin: 20px;
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
    .row {
        width: 50%;
        margin: 0 auto !important;
    }
</style>
