<template>
    <div class="container">
        <h1>Ventas del día</h1>
        <br />
        <v-data-table :headers="headers" :items="productosNombre" :items-per-page="5" class="elevation-1"> </v-data-table>
        <!-- {{ obtenerProductos }} -->
        <br />
        <download-excel :data="json_data" name="excel.xls" class="btn btn-dark">Guardar excel</download-excel>
        <button v-print="'#printMe'" class="btn-impr btn btn-dark">Imprimir</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                productos_tabla: [],
                json_fields: {
                    Producto: 'producto',
                    Fecha: 'fecha',
                    Cantidades: 'cantidades',
                    PrecioVenta: 'precio',
                    PrecioCompra: 'precioCompra',
                    Ganancia: 'ganancia',
                },
                json_data: [],
                movimientos: [],
                productosNombre: [],
                tab: 'resta',
                printObj: {
                    id: 'printMe',
                    popTitle: 'good print',
                },
                headers: [{ text: 'Fecha', value: 'fecha' }, { text: 'Producto', value: 'producto.nombre' }, { text: 'Cantidad', value: 'valor' }, { text: 'Precio', value: 'producto.precioUnidad' }, { text: 'Diferencia' }, { text: 'Accion', value: 'accion' }],
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
                        if (movimiento.accion == 'resta') {
                            const producto = movimiento.producto.nombre;
                            const precioUnidad = movimiento.producto.precioUnidad;
                            const precioCompra = movimiento.producto.precioDistribuidoraUnidad;
                            const fecha = new Date(movimiento.fecha).toLocaleDateString();
                            movimientosExcel.producto = producto;
                            movimientosExcel.fecha = fecha;
                            movimientosExcel.cantidades = movimiento.valor;
                            movimientosExcel.precio = precioUnidad;
                            movimientosExcel.precioCompra = precioCompra;
                            movimientosExcel.ganancia = this.diferencia(movimiento.producto);
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
        },
        computed: {
            obtenerProductos(){
                this.productosNombre = this.movimientos.map(movimiento => {
                    return movimiento;
                })
                return this.productosNombre;
            },
            productos() {
                switch (this.tab) {
                    case 'resta':
                        return this.movimientos.filter((movimiento) => {
                            if (movimiento.accion) {
                                return movimiento.accion == 'resta';
                            }
                            return false;
                        });
                        break;
                    case 'nuevo':
                        return this.movimientos.filter((movimiento) => {
                            if (movimiento.accion) {
                                return movimiento.accion != 'resta';
                            }
                            return false;
                        });
                        break;
                    default:
                        return this.movimientos;
                        break;
                }
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
