<template>

 <v-app>
  <v-container>
    <v-container>
    <v-img 
      src="/img/delebritex.jpeg/"
      max-height="50%"
      max-width="auto%"
      contain
      position
    >
    </v-img>
    </v-container>
  </v-container>
  <v-spacer></v-spacer> 
  <v-card class="spaceCard" dark>
    <v-toolbar flat>
      <v-toolbar-title class="center">Nuestros productos</v-toolbar-title>
    </v-toolbar>
  </v-card>
  <v-carousel class="space">
    <v-carousel-item
      v-for="(item,i) in limitProduct()"
      :key="i"
      :src="item.imagen"
      reverse-transition="fade-transition"
      transition="fade-transition"
      to="/catalogo"
    ></v-carousel-item>
  </v-carousel>
 </v-app>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    data: () => ({
      length: 3,
      onboarding: 0,
      producto: '',
      productoId: '',
      colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
        array: [],
    }),
    beforeMount() {
      this.getProducts();
    },
    // created(){
    //   this.limitProduct()
    // },
    computed: {
            ...mapState({
                productos: (state) => state.productos,
                carrito: (state) => state.carrito,
                filtro: (state) => state.filtro.productos,
            }),
            
        },
    methods: {
        ...mapActions({
            getProducts: 'getProducts',
            addToCart: 'addToCart',
            removeFromCart: 'removeFromCart',
            findProduct: 'findProduct',
        }),
        
        limitProduct() {
                // const idx = Math.floor(Math.random() * this.productos.length)
                // const idx2 = this.productos[idx]
                const leng = this.productos.length - 5;
                console.log(leng);
                const array = [];
                for (let index = leng; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    console.log(element);
                    array.push(element);
                }
                return array;
            },
       
        changePaginate(){
          if (window.screen.width >= 420) {
            return 5;
          }else{
            return 3;
          }
        },
        

            changePaginate() {
                if (window.screen.width >= 420) {
                    return 5;
                } else {
                    return 3;
                }
            },

            limitProduct() {
                // const idx = Math.floor(Math.random() * this.productos.length)
                // const idx2 = this.productos[idx]
                const leng = this.productos.length - 5;
                console.log(leng);
                const array = [];
                for (let index = leng; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    console.log(element);
                    array.push(element);
                }
                return array;
            },

            // buscar el producto que selecciono el usuario en vuex
            conseguirProducto(item) {
                this.dialog = true;
                const id = item.id;
                for (let index = 0; index < this.productos.length; index++) {
                    const element = this.productos[index];
                    if (element.id == id) {
                        this.productoId = element;
                    }
                }
            },
            // agregar al carrito el producto que fue seleccionado con las cantidades elegidas.
            agregarAlCarrito() {
                if (this.cantidades > 0) {
                    this.productoId.cantidadElegida = this.cantidades;
                    this.addToCart(this.productoId);
                    this.dialog = false;
                    this.cantidades = 0;
                }
            },
            // suma las cantidades que quiere el usuario
            aumentarCantidad() {
                this.cantidades++;
            },
            // resta las cantidades que quiere el usuario
            restarCantidad() {
                this.cantidades--;
                if (this.cantidades <= 0) {
                    this.cantidades = 0;
                }
            },
            buscarProducto() {
                this.findProduct(this.producto);
            },
        },
    };
</script>
<style lang="scss">
    .space {
        margin-bottom: 20%;
    }
    .spaceCard {
        margin-bottom: 1%;
    }
</style>
