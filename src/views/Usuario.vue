<template>
    <div class="usuario margin">
        <!-- <v-app> -->
        <h1>Hola {{ usuario.nombre }}</h1>
        <h5>Estas son las compras que hiciste ultimamente</h5>
        <br />
        <v-card class="mx-auto mb-4" color="#EBEBEB" max-width="700" outlined v-for="(carrito, index) in accederNumeroCompra" :key="index">
            <div class="d-flex">
                <div class="p-usuario">Fecha: {{ carrito.fecha }}</div>
                <div class="p-usuario">Numero Compra: {{ carrito.numeroCompra }}</div>
            </div>
            <v-list-item three-line v-for="(item, index) in carrito.productos" :key="index">
                <v-list-item-content>
                    <v-list-item-title class=" mb-1">{{ item.producto }}</v-list-item-title>
                    <div class="d-flex">
                        <v-list-item-subtitle>Unidades: {{ item.unidades }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Empaques: {{ item.empaques }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Precio: ${{ item.precioTotal }}</v-list-item-subtitle>
                    </div>
                </v-list-item-content>
                <v-img class="white--text align-end" max-width="100" :src="item.imagen"> </v-img>
            </v-list-item>
            <br />
            <div class="p-usuario">
                <p>Total: $ {{ carrito.total }}</p>
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

                // console.log(lista);
                return lista;
            },
        },
        methods: {
            // Separar las reservas en objetos segun el numero de compra
            separarProductosPorCarrito() {
                const objeto = {};
                for (let index = 0; index < this.carrito.length; index++) {
                    const element = this.carrito[index];
                    if (!objeto.hasOwnProperty(element.numeroCompra)) {
                        objeto[element.numeroCompra] = [];
                    }
                    objeto[element.numeroCompra].push(element);
                }

                return objeto;
            },
            // Tranformar las reservas en un array gigante para podes acceder a ellas por un for y tambien generando un objeto con data basica de cada carrito
            carritoAListaDeProductos(carrito) {
                let lista_de_productos = [];
                for (const key in carrito) {
                    if (carrito.hasOwnProperty(key)) {
                        const productos = carrito[key];
                        // console.log(productos);
                        const carrito_final = this.generarObjetoDeCarrito(productos);
                        lista_de_productos.push(carrito_final);
                    }
                }
                lista_de_productos = lista_de_productos.sort((a, b) => {
                    let split_a = a.fecha.split('/');
                    let split_b = b.fecha.split('/');

                    const fecha_ordenada_a = [split_a[1], split_a[0], split_a[2]].join('/');
                    const fecha_ordenada_b = [split_b[1], split_b[0], split_b[2]].join('/');

                    const fecha_de_a = new Date(fecha_ordenada_a).getTime();
                    const fecha_de_b = new Date(fecha_ordenada_b).getTime();

                    return fecha_de_a < fecha_de_b ? 1 : fecha_de_a === fecha_de_b ? 0 : -1;
                });

                return lista_de_productos;
            },
            // Objeto para guardar en el array de Reservas con data basica de cada carrito
            generarObjetoDeCarrito(productos) {
                const carrito_final = {
                    total: 0,
                    estado: '',
                    fecha: '',
                    productos: [],
                    numeroCompra: '',
                };

                carrito_final.total = this.calcularTotalCarrito(productos);
                carrito_final.fecha = this.sacarFechaCarrito(productos);
                carrito_final.estado = this.calcularEstadoDeCarrito(productos);
                carrito_final.numeroCompra = this.numeroCompra(productos);

                carrito_final.productos = productos;
                return carrito_final;
            },
            // Sacar el total de cada carrito para guardar en el objeto
            calcularTotalCarrito(carrito) {
                return carrito.reduce((total, item) => total + Number(item.precioTotal), 0);
            },
            numeroCompra(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const numeroCompra = element.numeroCompra;
                    return numeroCompra;
                }
            },
            // Sacar el estado de cada carrito para guardar en el objeto
            calcularEstadoDeCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const estado = element.estado;
                    if (estado == 10) {
                        return 'Entregado';
                    } else if (estado == 1) {
                        return 'Esperando que acepte';
                    } else if (estado == 3) {
                        return 'Rechazado';
                    } else if (estado == 5) {
                        return 'Aceptado';
                    }
                }
            },
            // Sacar la fecha de cada carrito para guardar en el objeto
            sacarFechaCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const fecha = this.resetearFecha(element.createdAt);
                    return fecha;
                }
            },
            // Traer al ussuario de la db segun el id que guardamos en localStorage.
            listarUsuario() {
                const usuarios = localStorage.getItem('usertoken');
                const objeto = JSON.parse(usuarios);
                const id = objeto['id'];
                this.axios.get(`/usuario/${id}`).then((res) => {
                    this.usuario = res.data;
                });
            },
            // Buscar el carrito del usuario en la db segun el id que esta en localStorage
            accederCarrito() {
                const storage = localStorage.getItem('usertoken');
                const usuario = JSON.parse(storage);
                const id = usuario['id'];
                this.axios.get(`/carrito/${id}`).then((res) => {
                    this.carrito = res.data;
                    console.log(this.carrito);
                });
            },
            // Tranformar la fecha en DD-MM-YYYY
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style lang="scss">
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
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
