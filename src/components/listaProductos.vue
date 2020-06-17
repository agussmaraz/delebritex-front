<template>
    <div>
        <v-card class="p-2" width="300" tile>
            <h5>Productos</h5>
            <v-text-field @keyup="buscarProducto()" @keyup.delete="getProducts()" v-model="busqueda" label="Buscar"> </v-text-field>
            <v-list style="max-height: 300px" class="overflow-y-auto" rounded>
                <v-list-item-group color="primary">
                    <v-list-item v-for="(item, i) in filtro" :key="i" @click="elegirProducto(item)">
                        <v-list-item-subtitle class="text-capitalize">{{ item.nombre }} </v-list-item-subtitle>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
        <div>
            <v-row justify="center">
                <v-dialog v-model="dialog" max-width="290">
                    <v-card>
                        <v-card-title class="headline text-capitalize">{{ this.productoElegido.nombre }}</v-card-title>
                        <v-card-text>
                            <v-list-item-subtitle> Unidades: {{ this.productoElegido.totalUnidad }}</v-list-item-subtitle>
                            <v-list-item-subtitle> Bultos: {{ empaques }} </v-list-item-subtitle>
                            <span> Las unidades por bulto son: {{ this.productoElegido.unidadPorEmpaque }} </span>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <div>
                                Unidades
                                <div>
                                    <v-btn small @click="aumentarUnidad()">+ </v-btn>
                                    {{ unidades }}
                                    <v-btn small @click="restarUnidad()"> -</v-btn>
                                </div>
                            </div>
                            <div class="ml-5">
                                Bultos
                                <div>
                                    <v-btn small @click="aumentarBulto()">+ </v-btn>
                                    {{ bultos }}
                                    <v-btn small @click="restarBulto()"> -</v-btn>
                                </div>
                            </div>
                        </v-card-actions>
                        <v-btn class="mt-2 mb-3" @click="agregarProducto()">Agregar</v-btn>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    export default {
        name: 'listaProductos',
        data() {
            return {
                productoElegido: '',
                busqueda: '',
                dialog: false,
                unidades: 0,
                bultos: 0,
            };
        },
        methods: {
            ...mapActions({
                findProduct: 'findProduct',
                addCartAdmin: 'addCartAdmin',
                removeCartAdmin: 'removeCartAdmin',
                getProducts: 'getProducts',
            }),
            agregarProducto() {
                let buffer = {};
                const storage = localStorage.getItem('usertoken');
                const usuario = JSON.parse(storage);
                const numero = Math.round(Math.random() * 100000);
                const id = usuario['id'];
                buffer.usuario = {
                    nombre: 'Admin',
                };
                buffer.id = this.productoElegido.id
                buffer.numeroCompra = numero;
                buffer.createdAt = new Date();
                buffer.producto = this.productoElegido.nombre;
                buffer.unidades = this.unidades;
                buffer.empaques = this.bultos;
                buffer.unidadPorEmpaque = this.productoElegido.unidadPorEmpaque;
                buffer.precioUnidad = this.productoElegido.precioUnidad;
                buffer.precioBulto = this.productoElegido.precioBulto;
                buffer.imagen = this.productoElegido.imagen;
                buffer.estado = 10;
                this.addCartAdmin(buffer);
                this.dialog = false;
                this.unidades = 0;
                this.bultos = 0;
            },
            buscarProducto() {
                this.findProduct(this.busqueda);
            },
            elegirProducto(item) {
                this.dialog = true;
                this.productoElegido = item;
            },
            aumentarUnidad() {
                this.unidades++;
            },
            aumentarBulto() {
                this.bultos++;
            },
            restarUnidad() {
                this.unidades--;
            },
            restarBulto() {
                this.bultos--;
            },
            getColor(estado) {
                if (estado == 'Preparando') return 'green';
                else if (estado > 'Rechazado') return 'orange';
                else return 'yellow';
            },
        },
        computed: {
            ...mapState({
                productos: (state) => state.productos,
                filtro: (state) => state.filtro.productos,
                carritoAdmin: (state) => state.carritoAdmin,
            }),
            empaques() {
                const unidadPorEmpaque = this.productoElegido.unidadPorEmpaque;
                const unidades = this.productoElegido.totalUnidad;
                return Math.ceil(Number(unidades) / Number(unidadPorEmpaque));
            },
        },
        beforeMount() {
            this.getProducts();
        },
    };
</script>

<style></style>
