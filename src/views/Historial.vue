<template>
    <div>
        <h1>Historial</h1>
        <v-data-table :headers="headers" :items="obtenerMovimientos" :items-per-page="5" class="elevation-1 tabla-historial mt-5"> </v-data-table>
        <br />
        <v-container max-width="400">
            <v-row class="" justify="center" no-gutters>
                <v-col lg="2">
                    <v-card class="mx-auto" outlined tile> </v-card>
                </v-col>
                <v-col lg="2">
                    <v-card class="mx-auto" outlined tile></v-card>
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
                headers: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Numero Compra', value: 'numeroCompra' },
                    { text: 'Cantidad', value: 'cantidades' },
                    { text: 'Precio', value: 'total' },
                    { text: 'Usuario', value: 'usuario' },
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
                        const productos = movimiento.productos;
                        const precioUnidad = movimiento.precioUnidad * movimiento.valor;
                        movimientosExcel.Producto = productos;
                        movimientosExcel.Cantidades = movimiento.valor;
                        movimientosExcel.Precio = precioUnidad;
                        // console.log(movimientosExcel);
                        this.json_data.push(movimientosExcel);
                    });
                    // console.log(this.json_data);
                });
            },
            arrayPorNumeroCompra() {
                const objeto = {};
                for (let index = 0; index < this.movimientos.length; index++) {
                    const element = this.movimientos[index];
                    if (!objeto.hasOwnProperty(element.numeroCompra)) {
                        objeto[element.numeroCompra] = [];
                    }
                    objeto[element.numeroCompra].push(element);
                }
                return objeto;
                // console.log(objeto)
            },
            arrayDeObjetos(item) {
                const listaMovimientos = [];
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const compras = item[key];
                        const data_general = this.generarObjeto(compras);
                        listaMovimientos.push(data_general);
                    }
                }
                return listaMovimientos;
            },
            generarObjeto(compras) {
                const movimiento_final = {
                    fecha: '',
                    numeroCompra: '',
                    total: '',
                    cantidades: '',
                    usuario: '',
                    productos: [],
                };
                movimiento_final.fecha = this.sacarFecha(compras);
                movimiento_final.numeroCompra = this.sacarNumeroCompra(compras);
                movimiento_final.total = this.sacarTotal(compras);
                movimiento_final.cantidades = this.sacarCantidades(compras);
                movimiento_final.usuario = this.sacarUsuario(compras);
                movimiento_final.productos = compras;
                return movimiento_final;
            },
            sacarFecha(compras) {
                for (let index = 0; index < compras.length; index++) {
                    const element = compras[index];
                    const fecha = element.fecha;
                    return fecha;
                }
            },
            sacarNumeroCompra(compras) {
                for (let index = 0; index < compras.length; index++) {
                    const element = compras[index];
                    const numeroCompra = element.numeroCompra;
                    return numeroCompra;
                }
            },
            sacarCantidades(compras) {
                return compras.reduce((total, item) => total + Number(item.valor), 0);
            },
            sacarTotal(compras) {
                return compras.reduce((total, item) => total + Number(item.precioTotal), 0);
            },
            sacarUsuario(compras) {
                for (let index = 0; index < compras.length; index++) {
                    const element = compras[index];
                    const usuario = element.usuario;
                    return usuario;
                }
            },
        },
        computed: {
            obtenerMovimientos() {
                const listaNumeroCompra = this.arrayPorNumeroCompra();
                const array = this.arrayDeObjetos(listaNumeroCompra);
                // console.log(array);
                return array;
            },
        },
    };
</script>

<style>
    .tabla-historial {
        width: 80% !important;
        margin: 0 auto;
    }
</style>
