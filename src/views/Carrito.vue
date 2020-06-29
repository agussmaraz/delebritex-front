<template>
    <v-app>
        <div class="checkout-box margin">
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <ul v-for="(item, index) in carrito" :key="index" class="checkout-list">
                <li class="checkout-product">
                    <img :src="item.imagen" alt="" class="product-image" />
                    <h3 class="product-name">{{ item.nombre }}</h3>
                    <span class="product-price">{{ item.paquetesElegidos }}</span>
                    <span class="product-price">{{ cantidad(item) }} unidades</span>

                    <span class="product-price">${{ calcularPrecio(item) }}</span>
                    <button class="product-remove" @click="removeItemFromCart(item)">X</button>
                </li>
            </ul>
            <div class="checkout-message">
                <h3 v-if="carrito.length == 0">No tenes poductos en el carrito todavia!</h3>
                <div class="d-flex justify-content-around">
                    <v-btn to="/catalogo" class="boton">Seguir comprando</v-btn>
                    <v-btn v-if="carrito.length >= 1" @click="removeFromCart()">Vaciar el carrito</v-btn>
                    <v-btn v-if="carrito.length >= 1" @click="openTicket = !openTicket">Continuar</v-btn>
                </div>
                <v-overlay v-if="openTicket">
                    <v-card>
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
                        <!-- <v-btn @click="exportPDF()" >Obtener ticket</v-btn> -->
                        <v-btn @click="guardarCarrito()"> Comprar </v-btn>
                        <v-btn @click="closeOverlay()">Cerrar</v-btn>
                    </v-card>
                </v-overlay>
            </div>
            <h3 v-if="carrito.length >= 1" class="total">Total: ${{ sumaPrecio(this.carrito) }}</h3>
            <h3 class="total">{{ this.descuento }}</h3>
        </div>
    </v-app>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    export default {
        data() {
            return {
                openTicket: false,
                info: [],
                bodyInfo: [],
                ticket: [],
                dismissSecs: 5,
                dismissCountDown: 0,
            };
        },
        computed: {
            ...mapState({
                carrito: (state) => state.carritos.carrito,
                mensaje: (state) => state.carritos.mensaje,
            }),
            ...mapGetters({
                paquetes: 'carritos/paquetes',
                cantidades: 'carritos/cantidadesElegida',
            }),

            descuento() {
                console.log(this.paquetes);
                if (this.paquetes >= 10) {
                    const porcentaje = (Number(this.sumaPrecio(this.carrito)) * 20) / 100;
                    const total = this.sumaPrecio(this.carrito) - Number(porcentaje);
                    return '$' + total;
                    // console.log(total)
                }
            },
        },
        methods: {
            ...mapActions({
                removeFromCart: 'carritos/removeFromCart',
                removeItemFromCart: 'carritos/removeItemFromCart',
                removeQuantity: 'productos/removeQuantity',
                newCart: 'carritos/newCartDB',
            }),
            sumaPrecio(item) {
                return item.reduce((total, item) => total + Number(this.calcularPrecio(item)), 0);
            },
            cantidad(carrito) {
                const totalUnidadesPaquete = Number(carrito.paquetesElegidos) * Number(carrito.unidadPorEmpaque);
                const cantidadesTotal = Number(carrito.cantidadElegida) + Number(totalUnidadesPaquete);
                return cantidadesTotal;
            },
            // Funcion para cerrar el ticket
            closeOverlay() {
                this.openTicket = false;
            },
            // Funcion para modificar como es que queremos que se vea el pdf a la hora de exportarlo y con que data.
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
                // doc.save('ticket.pdf');
            },
            // Guardar el carrito en la base de datos transformandolo en el objeto que nos parece mas conveniente
            guardarCarrito() {
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
                    };
                    return info;
                });
                this.newCart(payload);
                this.showAlert();
                this.openTicket = false;
                this.exportPDF();
            },

            // Sacar el precio de las unidades que eligio
            calcularPrecio(item) {
                const totalPaquetes = Number(item.paquetesElegidos) * Number(item.precioBulto);
                const totalUnidades = Number(item.cantidadElegida) * Number(item.precioUnidad);
                return Number(totalPaquetes) + Number(totalUnidades);
            },
            // Sacar el precio total a pagar
            calcularTotal() {
                return this.info.reduce((total, item) => total + Number(item.precioUnidad), 0);
            },
            // Funciones para el alert de bootstrap
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
    };
</script>

<style lang="scss">
    .margin {
        @media screen and (max-width: 990px) {
            margin-bottom: 40% !important;
        }
        @media screen and (max-height: 1903px) {
            margin-bottom: 40% !important;
        }
    }
    .checkout-box {
        width: 100%;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        box-sizing: border-box;
        padding: 1em;
    }

    .checkout-list {
        padding: 0 !important;
    }

    .checkout-product {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr 1fr;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        list-style: none;
        box-sizing: border-box;
        padding: 0.8em;
        margin: 1rem 0;
    }

    .checkout-product * {
        place-self: center;
    }
    .product-image {
        grid-column: 1/2;
        width: 50%;
        height: 160%;
        border-radius: 50%;
    }

    .product-name {
        box-sizing: border-box;
    }

    .product-price {
        font-size: 1.2em;
        font-weight: bold;
    }

    .product-remove {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 0;
        background-color: #e0e0e0;
        color: #fff;
        cursor: pointer;
    }

    .total {
        font-size: 2em;
        font-weight: bold;
        align-self: flex-end;
    }

    .checkout-message {
        font-size: 1.5em;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        transform: translateX(-40px);
        opacity: 0;
    }
    .boton {
        text-decoration: none !important;
    }
    .ticket {
        width: 700px;
        height: auto;
        background-color: #fafafa !important;
        padding: 1em 0.5em;
    }
    .ticketText {
        color: #000 !important;
        margin-right: auto !important;
    }
</style>
