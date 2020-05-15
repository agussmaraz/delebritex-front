<template>
    <div class="container">
        <h1>Ventas del día</h1>
        <br />
        <ul type="none" class="lista-ventas">
            <li class="li-venta" @click="returnData('resta')">Vendido</li>
            <li class="nuevo-venta" @click="returnData('nuevo')">Nuevo</li>
        </ul>
        <table class="table table-hover crud-ventas" id="printMe">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Accion</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in productos" :key="index">
                    <td>{{ resetearFecha(item.fecha) }}</td>
                    <td>{{ item.producto.nombre }}</td>
                    <td>{{ item.valor }}</td>
                    <td>{{ item.accion }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <button v-print="'#printMe'">Imprimir</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                movimientos: [],
                tab: 'resta',
                printObj: {
                    id: 'printMe',
                    popTitle: 'good print',
                },
            };
        },
        created() {
            this.listarMovimientos();
        },
        methods: {
            listarMovimientos() {
                this.axios.get('/movimientos').then((res) => {
                    this.movimientos = res.data;
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            returnData(nombre) {
                this.tab = nombre;
            },
        },
        computed: {
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
</style>
