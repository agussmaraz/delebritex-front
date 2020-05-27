<template>
    <div class="container margin" data-app>
        <h1>Ventas del día</h1>
        <v-btn color="secondary" @click="reservasCaja = !reservasCaja">Reservas</v-btn>
        <v-data-table :headers="headersReservas" :items="accederNumeroCompra" :items-per-page="5" class="elevation-1 tabla-reservas mt-5" v-show="reservasCaja">
            <template v-slot:top>
                <v-dialog v-model="dialog" width="500">
                    <v-card class="mx-auto" outlined>
                        <v-list-item v-for="(item, index) in reserva" :key="index" three-line>
                            <v-list-item-content>
                                <v-list-item-title class="text-capitalize mb-1"> {{ item.producto }} </v-list-item-title>
                                <div class="d-flex">
                                    <v-list-item-subtitle>Unidades: {{ item.unidades }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>Precio: ${{ item.precioUnidad }}</v-list-item-subtitle>
                                </div>
                            </v-list-item-content>
                            <v-img class="white--text align-end" max-width="100" :src="item.imagen"> </v-img>
                        </v-list-item>
                    </v-card>
                </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="mostrarReserva(item)">
                    mdi-eye
                </v-icon>
            </template>
        </v-data-table>

        <br />
        <v-data-table :headers="headers" :items="obtenerMovimientos" :items-per-page="5" class="elevation-1 mt-5"> </v-data-table>
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
                reserva: [],
                dialog: false,
                reservasCaja: false,
            };
        },
        created() {
            this.listarMovimientos();
            this.accederReservas();
        },
        methods: {
            // abrirReservas(){
            //     this.reservasCaja = true;
            // },
            // Es una funcion para traer lo que se vendio de la db y convertirlo en un excel
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
                });
            },
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
                };
                reserva_final.email = this.sacarEmail(productos);
                reserva_final.usuario = this.sacarUsuario(productos);
                reserva_final.fecha = this.sacarFechaCarrito(productos);
                reserva_final.estado = this.calcularEstadoDeCarrito(productos);

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
                return 'hola';
            },
            // Para el objeto del carrito y ver en fecha se hizo la compra
            sacarFechaCarrito(carrito) {
                for (let index = 0; index < carrito.length; index++) {
                    const element = carrito[index];
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
            // Ventanita que se abre con la info de cada reserca
            mostrarReserva(item) {
                this.dialog = true;
                const productos = item.productos;
                this.reserva = item.productos;
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
            // Tranformar los movimientos en un array para el crud
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
            // Todas las reservas transformas en array y separadas por objetos segun numero de compra, listo para usar en el crud y obtener datos.
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
