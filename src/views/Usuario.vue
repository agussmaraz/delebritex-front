<template>
    <div class="usuario">
        <!-- <v-app> -->
        <h1>Hola {{ usuario.nombre }}</h1>
        <h5>Estas son las compras que hiciste ultimamente</h5>
        <br />
        <v-card class="mx-auto mb-4" max-width="700" outlined v-for="(carrito, index) in accederNumeroCompra" :key="index">
            <div class="p-usuario">Fecha: {{ carrito.fecha }}</div>
            <v-list-item three-line v-for="(item, index) in carrito.productos" :key="index">
                <v-list-item-content>
                    <v-list-item-title class=" mb-1">{{ item.producto }}</v-list-item-title>
                    <div class="d-flex">
                        <v-list-item-subtitle>Unidades: {{ item.unidades }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Precio: {{ item.precioTotal }}</v-list-item-subtitle>
                    </div>
                </v-list-item-content>
                <v-img class="white--text align-end" max-width="100" :src="item.imagen"> </v-img>
            </v-list-item>
            <br />
            <div class="p-usuario">
                <p>Total: {{ carrito.total }}</p>
                <p>Estado: {{ carrito.estado }}</p>
            </div>
        </v-card>
        <!-- </v-app> -->
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                usuario: '',
                carrito: [],
                comprasUsuario: [],
            };
        },
        created() {
            this.listarUsuario();
            this.accederCarrito();
        },
        computed: {
            accederNumeroCompra() {
                const carritos = this.separarProductosPorCarrito();
                const lista = this.carritoAListaDeProductos(carritos);

                return lista;
            },
        },
        methods: {
            separarProductosPorCarrito() {
                const objeto = {};
                console.log(this.carrito);
                for (let index = 0; index < this.carrito.length; index++) {
                    const element = this.carrito[index];
                    if (!objeto.hasOwnProperty(element.numeroCompra)) {
                        objeto[element.numeroCompra] = [];
                    }
                    objeto[element.numeroCompra].push(element);
                }

                return objeto;
            },
            carritoAListaDeProductos(carrito) {
                const lista_de_productos = [];
                for (const key in carrito) {
                    if (carrito.hasOwnProperty(key)) {
                        const productos = carrito[key];
                        const carrito_final = this.generarObjetoDeCarrito(productos);
                        lista_de_productos.push(carrito_final);
                    }
                }
                return lista_de_productos;
            },
            generarObjetoDeCarrito(productos) {
                const carrito_final = {
                    total: 0,
                    estado: '',
                    fecha: '',
                    productos: [],
                };

                carrito_final.total = this.calcularTotalCarrito(productos);
                carrito_final.fecha = this.sacarFechaCarrito(productos);
                carrito_final.estado = this.calcularEstadoDeCarrito(productos);

                carrito_final.productos = productos;
                // console.log(carrito_final);
                return carrito_final;
            },
            calcularTotalCarrito(carrito) {
                return carrito.reduce((total, item) => total + Number(item.precioTotal), 0);
            },
            calcularEstadoDeCarrito(carrito) {
                return 'hola';
            },
            sacarFechaCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const fecha = this.resetearFecha(element.createdAt);
                    return fecha;
                }
            },
            listarUsuario() {
                const usuarios = localStorage.getItem('usertoken');
                const objeto = JSON.parse(usuarios);
                const id = objeto['id'];
                this.axios.get(`/usuario/${id}`).then((res) => {
                    this.usuario = res.data;
                });
            },
            accederCarrito() {
                const storage = localStorage.getItem('usertoken');
                const usuario = JSON.parse(storage);
                const id = usuario['id'];
                this.axios.get(`/carrito/${id}`).then((res) => {
                    this.carrito = res.data;
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style>
    .usuario {
        margin: 2%;
    }
    .p-usuario {
        display: flex;
        justify-content: space-between;
        margin-left: 14%;
        font-weight: bold;
        margin-right: 5%;
    }
</style>
