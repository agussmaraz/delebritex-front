<template>
    <div id="app">
        <v-app>
            <b-navbar class="bg-dark" toggleable="lg" type="dark" variant="info">
                <b-navbar-brand to="/">Delebritex</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/">Inicio</b-nav-item>
                        <b-nav-item to="/contacto" v-if="isAdmin == 1">Contacto</b-nav-item>
                        <b-nav-item to="/catalogo">Catalogo</b-nav-item>
                        <!-- <b-nav-item to="/agregarProductos" v-if="isAdmin == 2">Nuevo Producto</b-nav-item> -->
                        <b-nav-item to="/quienesSomos">Quienes somos</b-nav-item>
                        <!-- <b-nav-item to="/producto" v-if="isAdmin == 2">Producto</b-nav-item> -->
                        <b-nav-item to="/productos" v-if="isAdmin == 2">Listado</b-nav-item>
                        <b-nav-item to="/ventas" v-if="isAdmin == 2">Ventas</b-nav-item>
                        <b-nav-item to="/login" v-if="isLogged == false">Iniciar Sesion</b-nav-item>
                        <b-nav-item to="/register" v-if="isLogged == false">Registrarse</b-nav-item>

                        <div class="nav-login" v-if="isLogged == true">
                            <b-nav-item to="/carrito"><b-icon icon="bag"></b-icon></b-nav-item>
                            <b-nav-item-dropdown right>
                                <!-- Using 'button-content' slot -->
                                <template v-slot:button-content>
                                    <em>{{ user.nombre }}</em>
                                </template>
                                <b-dropdown-item to="/usuario"> Compras</b-dropdown-item>
                                <b-dropdown-item @click="logout">Cerrar sesión</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </div>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
            <router-view />
        <v-footer
        class="grey darken-4 footer"
        padless
        absolute
        >
        <v-card
      flat
      tile
      class="grey darken-4 white--text center"
        >
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4 white--text"
          icon
        >
         <a :href="'http://' + icon.redirectTo" class="white--text"><v-icon size="24px" >{{ icon.iconName }}</v-icon></a>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Delebritex</strong>
      </v-card-text>
      
    </v-card>
  </v-footer>
        </v-app>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import jwtDecode from 'jwt-decode';
    export default {
        data() {
            return {
                icons: [
                    {
                        iconName: 'fab fa-facebook-f',
                        redirectTo: 'facebook.com',
                    },
                    {
                        iconName: 'fab fa-twitter',
                        redirectTo: 'twitter.com',
                    },
                    {
                        iconName: 'fab fa-instagram',
                        redirectTo: 'instagram.com',
                    },
                ],
            };
        },
        computed: {
            ...mapState({
                user: (state) => state.user,
            }),
            ...mapGetters({
                isLogged: 'isLogged',
                isAdmin: 'isAdmin',
            }),
        },
        methods: {
            ...mapActions({
                setUser: 'setUser',
                login: 'login',
                loginWithToken: 'loginWithToken',
            }),
            logout() {
                const usuario = JSON.parse(localStorage.getItem('usertoken'));
                const id = usuario['id'];
                this.axios.delete(`/usuarioToken/${id}`, { data: usuario }).then((res) => {
                    console.log('se elimino el token');
                    this.login(res.data);
                });
            },
        },
        created() {
            this.loginWithToken();
        },
    };
</script>
<style lang="scss">
    #app {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Source Sans Pro', sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .nav-login {
        display: flex;
    }
    .center {
        margin: auto !important;
    }
    .footer{
     bottom: 0 !important;
    }
    
</style>
