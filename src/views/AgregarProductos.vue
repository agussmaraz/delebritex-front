<template>
    <div class="agregarProductos">
        <h1>Agregar nuevos productos</h1>
        <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
        <v-form ref="form" class="container" @submit.prevent="nuevoProducto(producto)" enctype="multipart/form-data">
            <div class="form-group">
                <label>Producto</label>
                <input type="text" class="form-control input-form" v-model="producto.nombre" :counter="10" :rules="nameRules" label="Name" required />
                <p v-if="error" class=" p-error">
                    {{ this.error.nombre }}
                </p>
            </div>
            <article class="article-flex">
                <div class="form-group">
                    <label>Medida</label>
                    <br />
                    <select v-model="producto.medidaId">
                        <option v-for="(item, index) in medida" :key="index" :value="item.id">{{ item.medida }} </option>
                    </select>
                </div>
                <div class="empaque">
                    <label>Empaque</label>
                    <br />
                    <select v-model="producto.empaqueId">
                        <option v-for="(item, index) in empaque" :key="index" :value="item.id">{{ item.nombre }}</option>
                    </select>
                </div>
            </article>
            <p class="p-error ">
                {{ this.error.empaqueId }}
            </p>

            <br />
            <div class="form-group" v-if="producto.empaqueId == '1'">
                <label> Cantidad de paquetes</label>
                <input type="number" class="form-control input-form paquetes" v-model="producto.cantidadPaquetes" />
                <br />
            </div>
            <div class="form-group">
                <label v-if="producto.empaqueId !== 1">Unidades</label>
                <label v-else>Unidades por paquetes</label>
                <input type="number" class="form-control input-form " v-model="producto.unidadPorEmpaque" />
                <p v-if="producto.empaqueId == 1">El total de unidades es de: {{ totalUnidadesPorPaquete }}</p>
                <p class="p-error ">
                    {{ this.error.unidadPorEmpaque }}
                </p>
            </div>
            <div class="form-group">
                <label>Peso por unidad</label>
                <input type="number" class="form-control input-form " v-model="producto.pesoUnidad" />
                <p>El peso total es de: {{ totalPeso }}</p>
                <p class="p-error ">
                    {{ this.error.pesoUnidad }}
                </p>
            </div>
            <div class="form-group">
                <label>Categoria</label>
                <br />
                <select v-model="producto.categoriaId">
                    <option v-for="(item, index) in categoria" :key="index" :value="item.id"> {{ item.nombre }}</option>
                </select>
                <p class="p-error ">
                    {{ this.error.categoriaId }}
                </p>
            </div>
            <article>
                <div class="article-flex">
                    <div class="form-group">
                        <label>Precio por unidad</label>
                        <br />
                        <input type="number" v-model="producto.precioUnidad" />
                    </div>
                    <div v-if="producto.empaqueId == 1" class="form-group">
                        <label>Precio por bulto</label>
                        <br />
                        <input type="number" v-model="producto.precioBulto" />
                    </div>
                </div>
                <div class="article-flex">
                    <div class="form-group">
                        <label>Precio por unidad distribuidora</label>
                        <br />
                        <input type="number" v-model="producto.precioDistribuidoraUnidad" />
                    </div>
                    <div v-if="producto.empaqueId == 1" class="form-group empaque">
                        <label>Precio por bulto distribuidora</label>
                        <br />
                        <input type="number" v-model="producto.precioDistribuidoraBulto" />
                    </div>
                </div>
            </article>
            <div class="form-group">
                <label>Imagen del producto</label>
                <br />
                <input type="file" @change="imagenSeleccionada" />
                <p class="p-error ">
                    {{ this.error.imagen }}
                </p>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </v-form>
    </div>
</template>

<script>
    export default {
        computed: {
            totalUnidadesPorPaquete() {
                if (this.producto.empaqueId == '1') {
                    const totalUnidadPorEmpaque = this.producto.cantidadPaquetes * this.producto.unidadPorEmpaque;
                    return totalUnidadPorEmpaque;
                }
            },
            totalUnidades() {
                if (this.producto.empaqueId == '2') {
                    const totalUnidades = this.producto.unidadPorEmpaque;
                    return totalUnidades;
                }
            },
            totalPeso() {
                if (this.producto.empaqueId == '1') {
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
                    precioDistribuidoraBulto: ''
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
                const files = e.target.files;
                this.producto.imagen = files[0];
                // console.log(this.producto.imagen)
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
                formulario.append('nombre', this.producto.nombre);
                formulario.append('totalUnidad', this.producto.totalUnidad);
                formulario.append('medidaId', this.producto.medidaId);
                formulario.append('empaqueId', this.producto.empaqueId);
                formulario.append('pesoUnidad', this.producto.pesoUnidad);
                formulario.append('unidadPorEmpaque', this.producto.unidadPorEmpaque);
                formulario.append('categoriaId', this.producto.categoriaId);
                formulario.append('slug', this.producto.slug);
                formulario.append('imagen', this.producto.imagen);
                formulario.append('precioUnidad', this.producto.precioUnidad);
                formulario.append('precioBulto', this.producto.precioBulto);
                formulario.append('precioDistribuidoraUnidad', this.producto.precioDistribuidoraUnidad);
                formulario.append('precioDistribuidoraBulto', this.producto.precioDistribuidoraBulto);


                this.axios.post('/nuevoProducto', formulario).then((res) => {
                    console.log(res.data);
                    this.producto.nombre = '';
                    this.producto.medidaId = '';
                    this.producto.empaqueId = '';
                    this.producto.unidadPorEmpaque = '';
                    this.producto.pesoUnidad = '';
                    this.producto.categoriaId = '';
                    this.producto.precioUnidad = '';
                    this.producto.precioBulto = '';
                    this.producto.precioDistribuidoraUnidad = '';
                    this.producto.precioDistribuidoraBulto= '';

                    this.producto.imagen = '';
                    this.mensaje.texto = 'El producto fue agregado correctamente';
                    this.mensaje.color = 'success';
                    this.showAlert();
                });
            },
            listarMedida() {
                this.axios.get('/buscarMedida').then((res) => {
                    this.medida = res.data;
                });
            },
            listarEmpaque() {
                this.axios.get('/empaqueBuscar').then((res) => {
                    this.empaque = res.data;
                });
            },
            listarCategoria() {
                this.axios.get('categoriaBuscar').then((res) => {
                    this.categoria = res.data;
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
</style>
