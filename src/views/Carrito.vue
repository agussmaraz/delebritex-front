<template>
    <v-app>
        <div class="space">
        <div class="list-checkout" v-if="carrito.length >= 1">
            <ul class="checkout-list">
                <li class="list-of-names">
                    <span class="list-names"></span>
                    <span class="list-names">Producto</span>
                    <span class="list-names">Paquetes</span>
                    <span class="list-names">Unidades</span>
                    <span class="list-names">Precio Unidad</span>
                    <span class="list-names">Subtotal</span>
                    <span class="list-names">Eliminar</span>
                </li>
            </ul>
        </div>
        <div class="checkout-box">
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <div class="overflow-y-auto" style="max-height: 550px">
                <ul v-for="(item, index) in carrito" :key="index" class="checkout-list overflow-y-auto" style="max-height: 300px">
                    <li class="checkout-product">
                        <img :src="item.imagen" alt="" class="product-image" />
                        <h4 class="product-name">{{ item.nombre }}</h4>
                        <span class="product-price">{{ item.paquetesElegidos }}</span>
                        <span class="product-price">{{ cantidad(item) }}</span>
                        <span class="product-price">${{item.precioUnidad}}</span>
                        <span class="product-price">${{ calcularPrecio(item) }}</span>
                        <button class="product-remove" @click="removeItemFromCart(item)">X</button>
                    </li>
                </ul>
            </div>
                <div class="checkout-message">
                    <h3 v-if="carrito.length == 0">No tenes poductos en el carrito todavia!</h3>
                    <v-img v-if="carrito.length == 0" src="/img/fondo.png" width="70%" class="background-margin"></v-img>
                    <div class="d-flex justify-content-around">
                        <v-btn icon small to="/catalogo" class="boton"><v-icon class="fas fa-angle-left"></v-icon></v-btn>
                        <v-btn icon small v-if="carrito.length >= 1" @click="removeFromCart()"><v-icon class="fas fa-trash"></v-icon></v-btn>
                        <v-btn icon small v-if="carrito.length >= 1" @click="changeState()"><v-icon class="fas fa-angle-right"></v-icon></v-btn>
                    </div>
                    <v-overlay v-if="dialog">
                        <dialogCarrito />
                    </v-overlay>
                </div>
                <div class="total">
                    <h3 v-if="carrito.length >= 1">Total: ${{ sumaPrecio(this.carrito) }}</h3>
                    <h3 v-if="carrito.paquetesElegidos >= 10">Con descuento: {{ this.descuento }}</h3>
                </div>
            </div>
        </div>
    <!-- </div> -->
    </v-app>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    import dialogCarrito from '../components/dialogCarrito';
    export default {
        components: {
            dialogCarrito: dialogCarrito,
        },
        data() {
            return {
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
                dialog: (state) => state.dialog,
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
                changeState: 'changeStateDialogTrue'
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
                if (this.mensaje.color == 'success') {
                    this.exportPDF();
                }
                if (this.mensaje.color == 'success') {
                   this.removeFromCart(); 
                }
                
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
    .background-margin {
        margin-left: auto !important;
        margin-right: auto !important;
        margin-bottom: 100px !important;
    }
    .checkout-box {
        width: 100%;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 1em;
    }

    .list-checkout {
        width: 100%;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0;
    }

    .checkout-list {
        padding: 0 !important;
    }

    .checkout-product {
        display: grid;
        grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 0.5fr 1fr;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        list-style: none;
        box-sizing: border-box;
        padding: 1em;
        margin: 0.5rem 0;
    }

    .list-of-names {
        display: grid;
        grid-template-columns: 0.7fr 1.5fr 1fr 1.5fr 1fr 1fr 1.5fr;
        background-color: #424242;
        color:#E9E9E9;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        list-style: none;
        box-sizing: border-box;
        padding: 1.5em;
        margin: 1rem 0;
    }
    
    .ticket-list {
        display: grid;
        grid-template-columns: 0.3fr 1.5fr 1fr 1.5fr 1fr 1.5fr;
        background-color: #1E1E1E;
        color:#E9E9E9;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        list-style: none;
        box-sizing: border-box;
        padding: 1em;
        margin: -2rem -0.8rem 0 -0.8rem;
    }

    .ticket-list * {
        place-self: center;
    }

    .list-of-names * {
        place-self: center;
    }

    .checkout-product * {
        place-self: center;
    }
    .product-image {
        grid-column: 1/2;
        width: 50%;
        height: 100%;
        border-radius: 50%;
        @media screen and (max-width:750px) {
            display: none;
        }
    }

    .product-name {
        box-sizing: border-box;
    }

    .product-price {
        font-size: 1.2em;
        font-weight: bold;
    }

    .list-names {
        font-size: 1.1vw;
        @media screen and (max-width: 360px) {
            font-size: 3vw;
            margin: auto 0 auto 8px;
        }
        @media screen and (max-width: 768px) {
            font-size: 3vw;
            margin: auto 0 auto 12px;
        }
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
        align-self: flex-end;
    }

    .total h3 {
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
    .space{

    @media screen and (max-width: 768px) {
            margin-bottom: 40rem;
        }
    }
</style>
