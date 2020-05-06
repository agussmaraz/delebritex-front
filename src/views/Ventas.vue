<template>
    <div class="container">
        <h1>Ventas</h1>
        <br />
        <ul type="none" class="lista-ventas">
            <li class="li-venta" @click="returnData()">Vendido</li>
            <li class="nuevo-venta">Nuevo</li>
        </ul>
        <table class="table table-hover crud-ventas">
            <thead>
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Accion</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in movimientos" :key="index">
                    <td>{{ resetearFecha(item.fecha) }}</td>
                    <td>{{ item.producto.nombre }}</td>
                    <td>{{ item.valor }}</td>
                    <td>{{ item.accion }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                movimientos: [],
                tab: 'Todos',
            };
        },
        created() {
            this.listarMovimientos();
        },
        methods: {
            listarMovimientos() {
                this.axios.get('/movimientos').then((res) => {
                    console.log(res.data);
                    this.movimientos = res.data;
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
            // returnData(){
            //     this.tab = Nuevo
            //     // console.log()
            // }
        },
        computed: {
            productos() {
                switch (this.tab) {
                    case 'Vendido':
                        return this.movimientos.filter((movimiento) => {
                            if (movimiento.accion) {
                                return movimiento.accion == 'Resta';
                            }
                            return false;
                        });
                        break;
                    case 'Nuevo':
                        return this.movimientos.filter((movimiento) => {
                            if (movimiento.accion) {
                                return movimiento.accion == 'Nuevo';
                            }
                            return false;
                        });
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
