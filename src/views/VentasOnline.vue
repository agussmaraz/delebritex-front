<template>
    <v-app>
        <div class="container margin" data-app>
            <h1>Ventas Online</h1>
            <v-data-table :headers="headersReservas" :items="accederNumeroCompra" :items-per-page="5" class="elevation-1 tabla-reservas mt-5">
                <template v-slot:top>
                    <v-dialog v-model="dialog" width="500">
                        <v-card class="mx-auto" outlined>
                            <v-list-item v-for="(item, index) in reserva" :key="index" three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-capitalize mb-1"> {{ item.producto }} </v-list-item-title>
                                    <div class="d-flex">
                                        <v-list-item-subtitle>Unidades: {{ item.unidades }}</v-list-item-subtitle>
                                        <v-list-item-subtitle>
                                            Bultos: {{ item.empaques }}
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <span class="tooltip-unidad" v-on="on">i</span>
                                                </template>
                                                <span>Uniades por bulto: {{ item.unidadPorEmpaque }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>

                                        <v-list-item-subtitle>Precio: ${{ precioTotalProducto(item) }}</v-list-item-subtitle>
                                    </div>
                                </v-list-item-content>
                                <v-img class="white--text align-end" max-width="100" :src="item.imagen"> </v-img>
                            </v-list-item>
                            <div class="pb-3" v-if="entrega">
                                <v-btn small class="ml-3" @click="entregarReserva()">Entregado</v-btn>
                            </div>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small color=" blue darken-2" class="mr-2" @click="mostrarReserva(item)">
                        mdi-eye
                    </v-icon>
                    <v-icon v-if="item.estado == 'Nuevo'" small color="green darken-2" class="mr-2" @click="aceptarReserva(item)">
                        mdi-checkbox-marked-circle
                    </v-icon>
                    <v-icon v-if="item.estado == 'Nuevo'" small color="red darken-2" class="mr-2" @click="rechazarReserva(item)">
                        mdi-cancel
                    </v-icon>
                </template>
            </v-data-table>
            <v-btn color="secondary" class="mb-5 mt-5" max-width="120" to="/historial">Historial</v-btn>
        </div>
    </v-app>
</template>

<script>
    export default {
        data() {
            return {
                productos_tabla: [],
                movimientos: [],
                reservas: [],
                printObj: {
                    id: 'printMe',
                    popTitle: 'good print',
                },
                headersReservas: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Numero', value: 'numeroCompra' },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Contacto', value: 'email' },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Accion', value: 'actions' },
                ],
                reserva: [],
                dialog: false,
                reservaEntrega: {},
                fechaObjeto: '',
                entrega: false,
            };
        },
        created() {
            this.accederReservas();
        },
        methods: {
            // Convertir la fecha en DD-MM-YYYY
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            // Sacar la ganancia de las ventas
            diferencia(producto) {
                const precioVenta = producto.precioUnidad;
                const precioCompra = producto.precioDistribuidoraUnidad;
                const diferencia = Number(precioVenta) - Number(precioCompra);
                return diferencia;
            },
            // Un objeto con info basica del carrito para tenerla siempre a mano
            generarObjetoDeCarrito(productos) {
                const reserva_final = {
                    estado: '',
                    fecha: '',
                    productos: [],
                    usuario: '',
                    email: '',
                    numeroCompra: '',
                };
                reserva_final.email = this.sacarEmail(productos);
                reserva_final.usuario = this.sacarUsuario(productos);
                reserva_final.fecha = this.sacarFechaCarrito(productos);
                reserva_final.estado = this.calcularEstadoDeCarrito(productos);
                reserva_final.numeroCompra = this.sacarNumeroCompra(productos);
                reserva_final.productos = productos;
                return reserva_final;
            },
            // Sacar el email del usuario para el objeto del carrito
            sacarEmail(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const email = element.usuario['email'];
                    return email;
                }
            },
            sacarNumeroCompra(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const numeroCompra = element.numeroCompra;
                    return numeroCompra;
                }
            },
            // Sacar el usuario del carrito para el objeto del carrito
            sacarUsuario(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const usuario = element.usuario['nombre'];
                    return usuario;
                }
            },
            // Proximamente para saber en que estado esta la reserva
            calcularEstadoDeCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const estado = element.estado;
                    if (estado == 1) {
                        return 'Nuevo';
                    } else if (estado == 5) {
                        return 'Preparando';
                    } else if (estado == 3) {
                        return 'Rechazado';
                    } else {
                        return 'Historial';
                    }
                }
            },
            // Para el objeto del carrito y ver en fecha se hizo la compra
            sacarFechaCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    this.fechaObjeto = element.createdAt;
                    const fecha = this.resetearFecha(element.createdAt);
                    return fecha;
                }
            },
            // Separar en objetos por numero de compra
            arrayPorNumeroCompra() {
                const objeto = {};
                for (let index = 0; index < this.reservas.length; index++) {
                    const element = this.reservas[index];
                    if (!objeto.hasOwnProperty(element.numeroCompra)) {
                        objeto[element.numeroCompra] = [];
                    }
                    objeto[element.numeroCompra].push(element);
                }
                return objeto;
            },
            // Encerrar en un array todo los carritos
            carritoAListaDeProductos(reservas) {
                const lista_de_productos = [];
                for (const key in reservas) {
                    if (reservas.hasOwnProperty(key)) {
                        const productos = reservas[key];
                        const reserva_final = this.generarObjetoDeCarrito(productos);
                        lista_de_productos.push(reserva_final);
                    }
                }
                return lista_de_productos;
            },
            // traer de la base de datos las reservas (carrito)
            accederReservas() {
                this.axios.get('/carrito').then((res) => {
                    this.reservas = res.data;
                });
            },
            // Ventanita que se abre con la info de cada reserva
            mostrarReserva(item) {
                this.dialog = true;
                this.reservaEntrega = item;
                this.reserva = item.productos;
                for (let index = 0; index < this.reserva.length; index++) {
                    const element = this.reserva[index];
                    if (element.estado == 5) {
                        this.entrega = true;
                    } else {
                        this.entrega = false;
                    }
                }
            },
            aceptarReserva(item) {
                const numeroCompra = item.numeroCompra;
                this.axios.put(`/carrito/${numeroCompra}`, { estado: '5' }).then((res) => {
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        const estado = element.estado;
                        return (item.estado = 'Preparando');
                    }
                });
                this.entrega = true;
            },
            rechazarReserva(item) {
                const numeroCompra = item.numeroCompra;
                this.axios.put(`/carrito/${numeroCompra}`, { estado: '3' }).then((res) => {
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        const estado = element.estado;
                        return (item.estado = 'Rechazado');
                    }
                });
            },
            entregarReserva() {
                const productos = this.reservaEntrega.productos;
                this.reservaEntrega.fecha = this.fechaObjeto;
                this.axios.post('/movimiento', this.reservaEntrega).then((res) => {
                    this.editarCarrito(this.reservaEntrega.numeroCompra);
                    this.reservaEntrega.estado = 'Historial';
                });
                this.dialog = false;
            },
            editarCarrito(numero) {
                this.axios.put(`/carrito/${numero}`, { estado: '10' }).then((res) => {
                    const index = this.reservas.findIndex((item) => Number(item.numeroCompra) == Number(res.data));
                    this.reservas.splice(index, 1);
                });
            },
            precioTotalProducto(item) {
                const totalPaquetes = Number(item.empaques) * Number(item.precioBulto);
                const totalUnidades = Number(item.unidades) * Number(item.precioUnidad);
                return Number(totalPaquetes) + Number(totalUnidades);
            },
        },
        computed: {
            // Calcular el total de ventas que se hizo en el dia
            totalVentas() {
                return this.movimientos
                    .filter((movimiento) => {
                        if (movimiento.accion == 'vendido') {
                            return movimiento;
                        }
                    })
                    .reduce((total, item) => total + Number(item.producto.precioUnidad), 0);
            },
            // Sacar el total de ganancias del dia
            totalGanancias() {
                return this.movimientos
                    .filter((movimiento) => {
                        if (movimiento.accion == 'vendido') {
                            return movimiento;
                        }
                    })
                    .reduce((total, item) => total + Number(item.producto.diferencia), 0);
            },

            // Todas las reservas transformas en array y separadas por objetos segun numero de compra, listo para usar en el crud y obtener datos.
            accederNumeroCompra() {
                const reservas = this.arrayPorNumeroCompra();
                const lista = this.carritoAListaDeProductos(reservas);
                return lista.filter((carritos) => {
                    if (carritos.estado !== 'Historial') {
                        return carritos;
                    }
                });
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
            margin-bottom: 20% !important;
        }
    }
    .crud-ventas {
        width: 80%;
        margin: 0 auto;
        border: 1px solid #dee2e6;
    }
    .lista-ventas {
        display: flex;
    }
    .nuevo-venta {
        margin-left: 10px;
        border: 2px solid #dee2e6;
        border-bottom: none;
        padding: 12px 12px 2px 12px;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: 20px;
    }
    .li-venta {
        border: 2px solid #dee2e6;
        border-bottom: none;
        padding: 12px 12px 2px 12px;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: 20px;
    }
    .btn-impr {
        margin-left: 6%;
    }
    .tabla-reservas {
        width: 60% !important;
        margin: 0 auto;
    }
    .tooltip-unidad {
        border: solid gray 1px;
        padding: 5px;
        border-radius: 10px;
        background-color: gray;
        color: white;
        margin-left: 4px;
    }
</style>
