<template>
    <div>
        <h1 class="mt-2">Ventas Online</h1>
        <v-data-table :headers="headersReservas" :items="productosPorCarrito" :items-per-page="5" class="elevation-1 tabla-online mt-5">
            <template v-slot:item.estado="{ item }">
                <v-chip :color="getColor(item.estado)"  dark>{{ test(item.estado) }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small color=" blue darken-2" class="mr-2" @click="mostrarReserva(item)">
                    mdi-eye
                </v-icon>
                <v-icon v-if="item.estado == 1" small color="green darken-2" class="mr-2" @click="changeState(item)">
                    mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-if="item.estado == 1" small color="red darken-2" class="mr-2" @click="reject(item)">
                    mdi-cancel
                </v-icon>
            </template>
            <template v-slot:top>
                <v-dialog v-model="dialog" width="500">
                    <v-card outlined>
                        <v-list-item v-for="(item, index) in productos" :key="index" three-line>
                            <v-list-item-content>
                                <v-list-item-title class="text-capitalize mb-1"> {{ item.producto }} </v-list-item-title>
                                <div class="d-flex">
                                    <v-list-item-subtitle>Unidades: {{ item.unidades }} </v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        Bultos: {{ item.empaques }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span class="tooltip-unidad" v-on="on">i</span>
                                            </template>
                                            <span>Uniades por bulto: {{ item.unidadPorEmpaque }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>

                                    <v-list-item-subtitle>Precio: undefined</v-list-item-subtitle>
                                </div>
                            </v-list-item-content>
                            <v-img class="white--text align-end" max-width="100"> </v-img>
                        </v-list-item>
                        <div class="pb-3">
                            <v-btn small class="ml-3" @click="newMovement(carrito)">Entregado</v-btn>
                        </div>
                    </v-card>
                </v-dialog>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    export default {
        data() {
            return {
                headersReservas: [
                    { text: 'Fecha', value: 'fecha' },
                    { text: 'Numero', value: 'numeroCompra' },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Contacto', value: 'email' },
                    { text: 'Estado', value: 'estado' },
                    { text: 'Accion', value: 'actions' },
                ],
                productos: [],
                dialog: false,
                carrito: '',
            };
        },
        methods: {
            test(estado) {
                if(estado == 1){
                    return 'Nuevo'
                } else if(estado == 3){
                    return 'Rechazado'
                } else {
                    return 'Preparando'
                }
            },
            ...mapActions({
                getCarritos: 'carritos/getAll',
                changeState: 'carritos/changeState',
                newMovement: 'carritos/newMovement',
                reject: 'carritos/reject',
            }),
            mostrarReserva(carrito) {
                this.dialog = true;
                this.carrito = carrito;
                this.productos = carrito['productos'];
            },
            getColor(estado) {
                if (estado == 5) return 'green';
                else if (estado == 3) return 'orange';
                else return 'yellow';
            },
        },
        computed: {
            ...mapGetters({
                productosPorCarrito: 'carritos/productosPorCarrito',
            }),
            ...mapState({
                carritos: (state) => state.carritos.lista,
            }),
        },
        async beforeMount() {
            await this.getCarritos();
        },
    };
</script>

<style>
    .tooltip-unidad {
        border: solid gray 1px;
        padding: 5px;
        border-radius: 10px;
        background-color: gray;
        color: white;
        margin-left: 4px;
    }
    .tabla-online {
        width: 800px;
        margin: 0 auto;
    }
</style>
