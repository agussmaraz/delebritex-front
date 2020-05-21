<template>
    <div class="container">
        <h1>Ventas del día</h1>
        <br />
        <v-data-table :headers="headers" :items="obtenerMovimientos" :items-per-page="5" class="elevation-1"> </v-data-table>
        <br />
        <v-container class="grey lighten-5">
            <v-row class="mb-6" justify="center" no-gutters>
                <v-col lg="2">
                    <v-card class="pa-2" outlined tile>
                       Total ventas: {{totalVentas}}
                    </v-card>
                </v-col>
                <v-col lg="2">
                    <v-card class="pa-2" outlined tile>
                        Total ganancias: {{totalGanancias}}
                    </v-card>
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
                    // TotalVentas: 'TotalVentas',
                    // TotalGanancias: 'TotalGanancias'
                },
                json_data: [],
                movimientos: [],
                tab: 'resta',
                printObj: {
                    id: 'printMe',
                    popTitle: 'good print',
                },
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
                            // movimientosExcel.TotalVentas = this.totalVentas;
                            // movimientosExcel.TotalGanancias = this.totalGanancias;
                            // console.log(movimientosExcel);
                            this.json_data.push(movimientosExcel);
                        }
                    });
                    console.log(this.json_data);
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
        },
    };
</script>

<style>
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
</style>
