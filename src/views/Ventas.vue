<template>
    <div class="container" data-app>
        <h1>Ventas del día</h1>
        <v-data-table :headers="headersReservas" :items="accederNumeroCompra" :items-per-page="5" class="elevation-1 tabla-reservas">
            
        </v-data-table>
       

        <br />
        <v-data-table :headers="headers" :items="obtenerMovimientos" :items-per-page="5" class="elevation-1"> </v-data-table>
        <br />
        <v-container max-width="400">
            <v-row class="" justify="center" no-gutters>
                <v-col lg="2">
                    <v-card class="mx-auto" outlined tile> Total ventas: {{ totalVentas }} </v-card>
                </v-col>
                <v-col lg="2">
                    <v-card class="mx-auto" outlined tile> Total ganancias: {{ totalGanancias }} </v-card>
                </v-col>
            </v-row>
        </v-container>
        <br />
        <download-excel :data="json_data" name="excel.xls" class="btn btn-dark">Guardar excel</download-excel>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                productos_tabla: [],
                json_fields: {
                    Producto: 'Producto',
                    Fecha: 'Fecha',
                    Cantidades: 'Cantidades',
                    PrecioVenta: 'Precio',
                    PrecioCompra: 'PrecioCompra',
                    Ganancia: 'Ganancia',
                },
                json_data: [],
                movimientos: [],
                reservas: [],
                tab: 'resta',
                printObj: {
                    id: 'printMe',
                    popTitle: 'good print',
                },
                headersReservas: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Contacto', value: 'email' },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Accion', value: 'actions' },
                ],
                headers: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Producto', value: 'producto.nombre' },
                    { text: 'Cantidad', value: 'valor' },
                    { text: 'Precio', value: 'producto.precioUnidad' },
                    { text: 'Diferencia', value: 'producto.diferencia' },
                    { text: 'Accion', value: 'accion' },
                ],
            };
        },
        created() {
            this.listarMovimientos();
            this.accederReservas();
        },
        methods: {
            listarMovimientos() {
                this.axios.get('/movimientos').then((res) => {
                    this.movimientos = res.data;
                    this.movimientos.forEach((movimiento) => {
                        let movimientosExcel = {};
                        if (movimiento.accion == 'vendido') {
                            const producto = movimiento.producto.nombre;
                            const precioUnidad = movimiento.producto.precioUnidad;
                            const precioCompra = movimiento.producto.precioDistribuidoraUnidad;
                            const fecha = new Date(movimiento.fecha).toLocaleDateString();
                            movimientosExcel.Producto = producto;
                            movimientosExcel.Fecha = fecha;
                            movimientosExcel.Cantidades = movimiento.valor;
                            movimientosExcel.Precio = precioUnidad;
                            movimientosExcel.PrecioCompra = precioCompra;
                            movimientosExcel.Ganancia = this.diferencia(movimiento.producto);

                            this.json_data.push(movimientosExcel);
                        }
                    });
                    // console.log(this.json_data);
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            returnData(nombre) {
                this.tab = nombre;
            },
            diferencia(producto) {
                const precioVenta = producto.precioUnidad;
                const precioCompra = producto.precioDistribuidoraUnidad;
                const diferencia = Number(precioVenta) - Number(precioCompra);
                return diferencia;
            },
            generarObjetoDeCarrito(productos) {
                const reserva_final = {
                    estado: '',
                    fecha: '',
                    productos: [],
                    usuario: '',
                    email: '',
                };
                reserva_final.email = this.sacarEmail(productos);
                reserva_final.usuario = this.sacarUsuario(productos);
                reserva_final.fecha = this.sacarFechaCarrito(productos);
                reserva_final.estado = this.calcularEstadoDeCarrito(productos);

                reserva_final.productos = productos;
                // console.log(reserva_final);
                return reserva_final;
            },
            sacarEmail(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const email = element.usuario['email'];
                    return email;
                }
            },
            sacarUsuario(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
                    const usuario = element.usuario['nombre'];
                    return usuario;
                }
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
            arrayPorNumeroCompra() {
                const objeto = {};
                for (let index = 0; index < this.reservas.length; index++) {
                    const element = this.reservas[index];
                    if (!objeto.hasOwnProperty(element.numeroCompra)) {
                        objeto[element.numeroCompra] = [];
                    }
                    objeto[element.numeroCompra].push(element);
                }

                // console.log(objeto);
                return objeto;
            },
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
            accederReservas() {
                this.axios.get('/carrito').then((res) => {
                    console.log(res.data);
                    this.reservas = res.data;
                });
            },
        },
        computed: {
            totalVentas() {
                return this.movimientos
                    .filter((movimiento) => {
                        if (movimiento.accion == 'vendido') {
                            return movimiento;
                        }
                    })
                    .reduce((total, item) => total + Number(item.producto.precioUnidad), 0);
            },
            totalGanancias() {
                return this.movimientos
                    .filter((movimiento) => {
                        if (movimiento.accion == 'vendido') {
                            return movimiento;
                        }
                    })
                    .reduce((total, item) => total + Number(item.producto.diferencia), 0);
            },
            obtenerMovimientos() {
                return this.movimientos
                    .filter((movimiento) => {
                        if (movimiento.accion == 'vendido') {
                            return movimiento;
                        }
                    })
                    .map((movimiento) => {
                        movimiento.fecha = this.resetearFecha(movimiento.fecha);
                        movimiento.producto.diferencia = this.diferencia(movimiento.producto);
                        return movimiento;
                    });
            },
            accederNumeroCompra() {
                const reservas = this.arrayPorNumeroCompra();
                const lista = this.carritoAListaDeProductos(reservas);
                return lista;
            },
        },
    };
</script>

<style lang="scss">
    .margin{
        @media screen and (max-width: 990px) {
        margin-bottom: 40% !important;
    }
    }
    .crud-ventas {
        width: 80%;
        margin: 0 auto;
        border: 1px solid#dee2e6;
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
    ul {
        margin-bottom: 0 !important;
        margin-left: 10%;
    }
    .btn-impr {
        margin-left: 6%;
    }
    .tabla-reservas {
        width: 50% !important;
        margin: 0 auto;
    }
</style>
