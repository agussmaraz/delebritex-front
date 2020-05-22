<template>
    <div class="checkout-box">
        <ul v-for="(item, index) in carrito" :key="index" class="checkout-list">
            <li class="checkout-product">
                <img :src="item.imagen" alt="" class="product-image" />
                <h3 class="product-name">{{ item.nombre }}</h3>
                <span class="product-price">${{ item.precioUnidad }}</span>
                <button class="product-remove" @click="removeItemFromCart(item)">X</button>
            </li>
        </ul>
        <div class="checkout-message">
            <h3 v-if="carrito.length == 0">No tenes poductos en el carrito todavia!</h3>
            <v-btn to="/catalogo" class="boton">Seguir comprando</v-btn>
            <v-btn v-if="carrito.length >= 1" @click="removeFromCart()">Vaciar el carrito</v-btn>
            <v-btn v-if="carrito.length >= 1" @click="openTicket = !openTicket">Continuar</v-btn>
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
                                <div>{{ item.precioUnidad }}</div>
                            </v-list-item>
                        </v-list-item>
                    </v-list>
                    <!-- <v-btn @click="exportPDF()" >Obtener ticket</v-btn> -->
                    <v-btn @click="guardarCarrito()"> Comprar </v-btn>
                    <v-btn @click="closeOverlay()">Cerrar</v-btn>
                </v-card>
            </v-overlay>
        </div>
        <h3 class="total">Total: ${{ sumaPrecio }}</h3>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    export default {
        data() {
            return {
                openTicket: false,
                info: [],
                bodyInfo: [],
                ticket: [],
            };
        },
        computed: {
            ...mapState({
                carrito: (state) => state.carrito,
            }),
            sumaPrecio() {
                return this.carrito.reduce((total, item) => total + Number(item.precioUnidad), 0);
            },
        },
        methods: {
            closeOverlay() {
                this.openTicket = false;
            },
            ...mapActions({
                removeFromCart: 'removeFromCart',
                removeItemFromCart: 'removeItemFromCart',
            }),
            exportPDF() {
                var doc = new jsPDF('p', 'pt');
                doc.text('Delebritex', 40, 40);
                this.info = this.carrito.map((element) => {
                    return element;
                });
                this.info.forEach((element) => {
                    const new_info = [element.nombre, element.precioUnidad];
                    this.ticket.push(new_info);
                });
                doc.autoTable({
                    theme: 'striped',
                    margin: { top: 60 },
                    head: [['Producto', 'Precio']],
                    body: this.ticket,
                });
                // doc.save('ticket.pdf');
            },
            guardarCarrito() {
                this.axios.post('/nuevo-carrito', this.carrito).then((res) => {
                    console.log(res);
                });
            },
        },
    };
</script>

<style>
    .checkout-box {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        box-sizing: border-box;
        padding: 1em;
    }

    .checkout-list {
        padding: 0;
    }

    .checkout-product {
        display: grid;
        grid-template-columns: 1fr 3fr 2fr 0.5fr;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        list-style: none;
        box-sizing: border-box;
        padding: 0.8em;
        margin: 1em 0;
    }

    .checkout-product * {
        place-self: center;
    }
    .product-image {
        grid-column: 1/2;
        width: 50%;
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
