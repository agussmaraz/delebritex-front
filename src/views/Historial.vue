<template>
    <div>
        <h1>Historial</h1>
        <v-data-table :headers="headers" :items="obtenerMovimientos" :items-per-page="5" class="elevation-1 tabla-historial mt-5">
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="verDetalle(item)">
                    mdi-eye
                </v-icon>
            </template>
            <template v-slot:top>
                <v-dialog v-model="dialog" width="400">
                    <v-card class="mx-auto" outlined>
                        <v-list-item v-for="(item, index) in detalleHistorial" :key="index" three-line>
                            <v-list-item-content>
                                <v-list-item-title class="text-capitalize mb-1"> {{ item.productos }} </v-list-item-title>
                                <div class="d-flex">
                                    <v-list-item-subtitle>Unidades: {{ item.unidades }} </v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        Empaques: {{ item.empaques }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span class="tooltip-unidad" v-on="on">i</span>
                                            </template>
                                            <span>Unidades por bulto: {{ item.unidadPorEmpaque }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>Precio: ${{ item.precioTotal }} </v-list-item-subtitle>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-dialog>
            </template>
        </v-data-table>
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
                    Bultos: 'Bultos',
                    Unidades: 'Unidades',
                    PrecioVenta: 'Precio',
                    PrecioCompra: 'PrecioCompra',
                    Ganancia: 'Ganancia',
                },
                detalleHistorial: [],
                dialog: false,
                json_data: [],
                movimientos: [],
                headers: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Numero Compra', value: 'numeroCompra' },
                    { text: 'Bultos', value: 'empaques' },
                    { text: 'Unidades', value: 'unidades' },
                    { text: 'Precio', value: 'total' },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Acción', value: 'actions' },
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
                    console.log(this.movimientos)
                    this.movimientos.forEach((movimiento) => {
                        let movimientosExcel = {};
                        const productos = movimiento.productos;
                        movimientosExcel.Producto = productos;
                        movimientosExcel.Bultos = movimiento.empaques;
                        movimientosExcel.Unidades = movimiento.unidades;
                        movimientosExcel.Precio= '$' + movimiento.precioTotal
                        movimientosExcel.Fecha = this.formatearFecha(movimiento.fecha);
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
                movimiento_final.empaques = this.sacarCantidadesEmpaque(compras);
                movimiento_final.unidades = this.sacarCantidadesUnidad(compras);
                movimiento_final.usuario = this.sacarUsuario(compras);
                movimiento_final.productos = compras;
                return movimiento_final;
            },
            sacarFecha(compras) {
                for (let index = 0; index < compras.length; index++) {
                    const element = compras[index];
                    const fecha = this.formatearFecha(element.fecha);
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
            sacarCantidadesUnidad(compras) {
                return compras.reduce((total, item) => total + Number(item.unidades), 0);
            },
            sacarCantidadesEmpaque(compras) {
                return compras.reduce((total, item) => total + Number(item.empaques), 0);
            },
            sacarTotal(compras) {
                return '$' + compras.reduce((total, item) => total + Number(item.precioTotal), 0);
            },
            sacarUsuario(compras) {
                for (let index = 0; index < compras.length; index++) {
                    const element = compras[index];
                    const usuario = element.usuario;
                    return usuario;
                }
            },
            formatearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            verDetalle(item) {
                this.dialog = true;
                this.detalleHistorial = item.productos;
                // console.log(this.detalleHistorial);
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
    .tooltip-unidad {
        border: solid gray 1px;
        padding: 5px;
        border-radius: 10px;
        background-color: gray;
        color: white;
        margin-left: 4px;
    }
</style>
