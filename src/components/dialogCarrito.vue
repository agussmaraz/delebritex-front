<template>
    <v-stepper v-if="openTicket" v-model="e1" class="step-style">
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Dirección</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Productos</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">Final</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <p class="p-step">Por favor, escriba la direccion de entrega del producto. El pago es en efectivo al momento de la entrega</p>
                <places v-model="direccion" placeholder="Inserte direccion" :options="options"> </places>
                <v-text-field v-model="piso" label="Piso" required></v-text-field>
                <v-text-field v-model="telefono" label="Telefono" required></v-text-field>

                <v-btn color="primary" @click="e1 = 2">
                    Continue
                </v-btn>

                <v-btn text @click="changeState()">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
                <v-card class="overflow-y-auto" style="max-height: 250px">
                    <v-list class="ticket" :light="true">
                        <v-list-item v-for="(item, index) in carrito" :key="index">
                            <v-list-item-avatar>
                                <v-img :src="item.imagen"></v-img>
                            </v-list-item-avatar>

                            <v-list-item>
                                <div>{{ item.nombre }}</div>
                            </v-list-item>
                            <v-list-item>
                                <div>{{ item.paquetesElegidos }}</div>
                            </v-list-item>

                            <v-list-item>
                                <div>x{{ cantidad(item) }}</div>
                            </v-list-item>
                            <v-list-item>
                                <div>${{ calcularPrecio(item) }}</div>
                            </v-list-item>
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-btn color="primary" @click="e1 = 3">
                    Continue
                </v-btn>

                <v-btn text @click="changeState()">Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
                <div>
                    <p class="p-step" v-if="piso.length < 1">La entrega sera a nombre de {{ usuario.nombre }} en la direccion {{ direccion }}</p>
                    <p class="p-step" v-else>La entrega sera a nombre de {{ usuario.nombre }} en la direccion {{ direccion }}, {{ piso }}</p>
                    <p class="p-step">En 'Usuario' => 'Compras', le aparecerá la compra y el estado de la misma.</p>
                    <p>Total: ${{ sumaPrecio(this.carrito) }}</p>
                </div>
                <v-btn color="primary" @click="guardarCarrito()">
                    Continue
                </v-btn>

                <v-btn text @click="changeState()">Cancel</v-btn>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    import Places from 'vue-places';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    export default {
        name: 'dialogCarrito',
        data() {
            return {
                openTicket: true,
                options: {
                    countries: ['AR'],
                },
                e1: 1,
                direccion: '',
                piso: '',
                telefono: '',
            };
        },
        components: {
            Places,
        },
        methods: {
            ...mapActions({
                removeFromCart: 'carritos/removeFromCart',
                removeItemFromCart: 'carritos/removeItemFromCart',
                removeQuantity: 'productos/removeQuantity',
                newCart: 'carritos/newCartDB',
                changeState: 'changeStateDialogFalse',
            }),
            cantidad(carrito) {
                const totalUnidadesPaquete = Number(carrito.paquetesElegidos) * Number(carrito.unidadPorEmpaque);
                const cantidadesTotal = Number(carrito.cantidadElegida) + Number(totalUnidadesPaquete);
                return cantidadesTotal;
            },
            calcularPrecio(item) {
                const totalPaquetes = Number(item.paquetesElegidos) * Number(item.precioBulto);
                const totalUnidades = Number(item.cantidadElegida) * Number(item.precioUnidad);
                return Number(totalPaquetes) + Number(totalUnidades);
            },
            sumaPrecio(item) {
                return item.reduce((total, item) => total + Number(this.calcularPrecio(item)), 0);
            },
            guardarCarrito() {
                let direccion = this.direccion;
                const storage = localStorage.getItem('usertoken');
                const usuario = JSON.parse(storage);
                const id = usuario['id'];
                const payload = this.carrito.map((producto) => {
                    const total = this.calcularPrecio(producto);
                    const info = {
                        id: producto.id,
                        nombre: producto.nombre,
                        totalUnidad: producto.cantidadElegida,
                        precioUnidad: producto.precioUnidad,
                        unidadPorEmpaque: producto.unidadPorEmpaque,
                        usuarioId: id,
                        imagen: producto.imagen,
                        empaques: producto.paquetesElegidos,
                        precioBulto: producto.precioBulto,
                        precioTotal: total,
                        piso: this.piso,
                        direccion: direccion,
                        telefono: this.telefono,
                    };
                    return info;
                });
                this.newCart(payload);
                this.showAlert();
                this.changeState();
                this.exportPDF();
            },
            exportPDF() {
                var doc = new jsPDF('p', 'pt');
                doc.text('Delebritex', 40, 40);
                this.info = this.carrito.map((element) => {
                    return element;
                });
                this.info.forEach((element) => {
                    const new_info = [element.nombre, element.cantidadElegida, '$' + element.precioUnidad];
                    this.ticket.push(new_info);
                });
                const total = ['Total: ' + this.calcularTotal()];
                this.ticket.push(total);
                doc.autoTable({
                    theme: 'striped',
                    margin: { top: 60 },
                    head: [['Producto', 'Unidades', 'Precio']],
                    body: this.ticket,
                });
                doc.save('ticket.pdf');
            },
            cerrarDialog() {
                this.openTicket = false;
            },
        },
        computed: {
            ...mapState({
                carrito: (state) => state.carritos.carrito,
                mensaje: (state) => state.carritos.mensaje,
                usuario: (state) => state.user,
                dialog: (state) => state.dialog,
            }),
            ...mapGetters({
                paquetes: 'carritos/paquetes',
                cantidades: 'carritos/cantidadesElegida',
            }),
        },
    };
</script>

<style>
    .step-style {
        width: 740px;
        height: 420px;
    }
    .p-step {
        font-size: 17px;
    }
</style>
