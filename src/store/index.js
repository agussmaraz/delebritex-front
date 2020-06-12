import Vue from 'vue';
import Vuex from 'vuex';
import { LayoutPlugin } from 'bootstrap-vue';
import axios from 'axios';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: null,
        //productos es un array vacio
        productos: [],
        // carrito vacio
        carrito: [],
        // estado para guardar los productos filtrados
        filtro: {
            productos: [],
        },
        carritoAdmin: [],
    },
    getters: {
        isLogged: (state) => !!state.user,
        isAdmin: (state) => state.user !== null && state.user.estado,
    },
    actions: {
        setUser({ commit }, user) {
            commit('SET_USER', user);
        },
        login({ commit }, user) {
            commit('LOGIN', user);
        },
        loginWithToken({ commit }) {
            const data = localStorage.getItem('usertoken');
            if (data) {
                const usuario = JSON.parse(data);
                const token = usuario['token'];
                axios.get(`http://localhost:3000/usuario/token/${token}`).then((res) => {
                    const usuarioToken = res.data;
                    commit('SET_USER', usuarioToken);
                });
            }
        },
        //traigo los datos de la bd
        getProducts({ commit }) {
            axios.get('/producto').then((res) => {
                //y los guardo en una constante
                const productos = res.data;
                // se los mando a una mutacion llamada set_products
                commit('SET_PRODUCTS', productos);
                commit('SET_FILTER', productos);
            });
        },
        // una funcion con el producto que mande a traves del boton "añadir al carrito"
        addToCart({ commit }, producto) {
            // si en el carrito no existe este producto
            if (!this.state.carrito.find((e) => e.slug == producto.slug)) {
                // llevemoslo a hacer una mutacion
                commit('ADD_TO_CART', producto);
            }
        },
        removeFromCart({ commit }) {
            commit('REMOVE_FROM_CART');
        },
        removeItemFromCart({ commit }, producto) {
            if (this.state.carrito.find((e) => e.id == producto.id)) {
                commit('REMOVE_ITEM_FROM_CART', producto);
            }
        },
        findProduct({ commit }, producto) {
            const resultados = this.state.productos.filter((elemento) => {
                if (elemento.nombre.toLowerCase().includes(producto)) {
                    return elemento;
                }
            });
            commit('SET_FILTER', resultados);
        },
        addCartAdmin({ commit }, producto) {
            commit('ADD_CART_ADMIN', producto);
        },
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        LOGIN(state, user) {
            if (!user.token) {
                state.user = false;
            } else {
                state.user = true;
            }
        },
        // en la mutacion traigo lo que voy a necesitar, en este caso el estado y los productos
        SET_PRODUCTS(state, productos) {
            // y aca guardo en estado.producto, los productos que traje antes
            state.productos = productos;
        },
        // en la mutacion le mando el estado y el producto
        ADD_TO_CART(state, producto) {
            // en el estado, la posicion carrito le vamos a agregar este producto
            state.carrito.push(producto);
        },
        REMOVE_FROM_CART(state) {
            state.carrito = [];
        },
        REMOVE_ITEM_FROM_CART(state, producto) {
            state.carrito = state.carrito.filter((e) => e != producto);
        },
        // guardamos en el estado todos los productos
        SET_FILTER(state, resultados) {
            state.filtro.productos = resultados;
        },
        ADD_CART_ADMIN(state, producto) {
            state.carritoAdmin.push(producto);
        },
    },
});

export default store;
