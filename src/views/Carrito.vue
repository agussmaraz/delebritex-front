<template>
  <div class="checkout-box">
    <ul 
      v-for="(item, index) in carrito"
      :key="index"
      class="checkout-list"
    >
      <li class="checkout-product">
        <img :src="item.imagen" alt="" class="product-image">
        <h3 class="product-name">{{item.nombre}}</h3>
        <span class="product-price">{{item.precio}}</span>
        <button class="product-remove" @click="removeItemFromCart(item)">X</button>
      </li>
    </ul>
    <div class="checkout-message">
      <h3 v-if="carrito.length == 0">No tenes productos en el carrito todavia!</h3>
      <v-btn to="/catalogo">Seguir comprando</v-btn>
      <v-btn v-if="carrito.length >= 1" @click="removeFromCart()">Vaciar el carrito</v-btn>
    </div>
    <h3 class="total">
     Total: {{}}
    </h3>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  export default {
    computed: {
      ...mapState({
          carrito: (state) => state.carrito
        }),
        sumaPrecio: () => {
           const sum = 0;
           return this.carrito.forEach(e => {
               sum += e.precio
            return sum
           });
        },
    },
    methods: {
        ...mapActions({
            removeFromCart: "removeFromCart",
            removeItemFromCart: "removeItemFromCart"
        }),
        
    }
  }
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
    grid-template-columns: 1fr 3fr 2fr .5fr;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
    border-radius: 5px;
    list-style: none;
    box-sizing: border-box;
    padding: .8em;
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
    background-color: #E0E0E0;
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

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to {
    transform: translateX(-40px);
    opacity: 0;
  }
</style>