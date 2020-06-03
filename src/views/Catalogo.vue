<template>
    <v-app class="margin" ref="layout">
        <div class="container catalogo">
            <v-app-bar color="grey darken-3 white--text">
        <v-app-bar-nav-icon
          color="white"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-toolbar-title>Nuestros productos</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-app-bar>
            <paginate 
              name="prod_filtered" 
              :list="filtro" 
              :per="10" 
              :container="this"
            >
                <v-row>
                    <v-card v-for="(item, index) in paginated('prod_filtered')" :key="index" class="texto-card m-3" max-width="300" max-height="350" @click="conseguirProducto(item)">
                        <v-img class="white--text align-end" height="200px" :src="item.imagen"> </v-img>
                        <v-card-title class="text-capitalize">{{ item.nombre }}</v-card-title>
                        <v-card-text class="text--primary">
                            <div>Whitsunday Island, Whitsunday Islands</div>
                            <div>${{ item.precioUnidad }}</div>
                        </v-card-text>
                    </v-card>
                </v-row>
            </paginate>
            <!-- <p v-for="(item, index) in paginated('prod_filtered')" :key="index">{{ item }}</p> -->
            <paginate-links
                for="prod_filtered"
                :limit="changePaginate()"
                :show-step-links="true"
                :step-links="{
                  next: '   ',
                  prev: ' '
                }"
                :container="{
                    state: paginate.prod_filtered,
                    el: $refs.layout,
                }"

            ></paginate-links>
            <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list-item>
          <v-list-item-content>
            <div class="d-flex">
              <v-text-field
                v-model="producto"
                @keyup="buscarProducto()"
                @keyup.delete="getProducts()"
                label="Buscar"
              >
              </v-text-field>
            </div>
          </v-list-item-content>

          <v-list-item-avatar>
            <v-icon class="fas fa-search"></v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>
          <v-treeview 
            selectable
            selected-color="green"
            activatable
            shaped
            rounded
            open-on-click
            :items="items"
          >
          </v-treeview>
        </v-list>
      </v-navigation-drawer>

            <!-- <paginate-links for="comida"></paginate-links> -->

            <v-dialog v-model="dialog" max-width="650" class="mobile">
                <v-card class="mx-auto" height="450" outlined>
                    <v-list-item three-line>
                        <v-img :src="this.productoId.imagen" width="70" height="280" class="m-3"> </v-img>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-1">{{ this.productoId.nombre }}</v-list-item-title>
                            <div class="d-flex justify-content-around flex-column sm-1">
                                <h4>Precio: ${{ this.productoId.precioUnidad }}</h4>
                                <h4>Stock: {{ this.productoId.totalUnidad }}</h4>
                            </div>
                        </v-list-item-content>
                    </v-list-item>

                    <v-card-actions class="justify-content-center d-flex flex-column sm-1">
                        <div class=" sm-1 marginBtn">
                            <v-btn @click="aumentarCantidad()">+ </v-btn>
                            {{ cantidades }}
                            <v-btn @click="restarCantidad()"> -</v-btn>
                            <v-divider></v-divider>
                            <v-btn class="text-center button" to="#" @click="agregarAlCarrito()">
                            Añadir al carrito
                        </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-app>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            paginate: ['prod_filtered'],
            drawer: null,
            productoId: '',
            dialog: false,
            cantidades: 0,
            producto: '',
            items: [
            {
                id: 1,
                name: 'Categorias :',
                children: [
                { id: 2, name: 'Trapos' },
                { id: 3, name: 'Valerinas' },
                { id: 4, name: 'Escobillas' },
                ],
            }
            ]
        };
    },
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
       
        changePaginate(){
          if (window.screen.width >= 420) {
            return 5;
          }else{
            return 3;
          }
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
        beforeMount() {
            this.getProducts();
        },
    }
</script>

<style lang="scss">
.card {
  width: 250px;
}

.row {
  width: 100% !important;
  justify-content: center;
}

.catalogo {
  margin-top: 2%;
}

.card-position {
  margin: 1.5%;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.19) !important;
  max-width: 20rem;
  @media screen and (max-width: 680px) {
    margin: 6%;
  }
}

.contenedor {
  max-width: 1455px !important;
  margin: 0 auto;
}

.center {
  text-align: center !important;
}

.texto-card {
  text-decoration: none !important;
}

.texto-card:hover {
  border: 1px solid rgb(199, 195, 195) !important;
}

.margin {
  @media screen and (max-width: 990px) {
    margin-bottom: 40% !important;
  }
  @media screen and (max-height: 1903px) {
    margin-bottom: 40% !important;
  }
}

.ml {
  margin-left: 0 auto !important;
}



.paginate-links {
        width: 100%;
        list-style: none;
        display: flex;
        justify-content: center;
        text-align: center;
        align-content: center;
        @media screen and (max-width: 1265px) {
          margin-left: -5%;
        }
    }
    .paginate-links li.number{
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
    }
    
    .paginate-links li.right-arrow{
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
    }

    .paginate-links li.left-arrow{
        margin-left: 2%;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
    }
    
    .paginate-links li.left-arrow a::before{
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      font-family: "Font Awesome 5 Free"; 
      font-weight: 900; 
      content: "\f100";
    }
    
    .paginate-links li.right-arrow a::before{
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      font-family: "Font Awesome 5 Free"; 
      font-weight: 900; 
      content: "\f101";
    }

    .paginate-links li.left-arrow.disabled a{
      color: #BDBDBD !important;
    }

    .paginate-links li.number.active{
        background-color:#424242;
    }
    
    .paginate-links li.number.active a{
        color: white;
    }

    .paginate-links li.ellipses{
        margin-left: 2%;
        margin-top: 0.5%;
        font-weight: bold;
    }

    .v-application a{
        color: black;
    }
</style>
