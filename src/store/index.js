import Vue from 'vue';
import Vuex from 'vuex';
import { LayoutPlugin } from 'bootstrap-vue';
import axios from 'axios';
Vue.use(Vuex);

import movimientos from './movimientos';
import carritos from './carrito';
import productos from './productos';

const store = new Vuex.Store({
    modules: {
        movimientos,
        carritos,
        productos,
    },
    state: {
        user: null,
        carritoAdmin: [],
        dialog: false,
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
                axios.get(`https://api.delebritex.com/usuario/token/${token}`).then((res) => {
                    const usuarioToken = res.data;
                    commit('SET_USER', usuarioToken);
                });
            }
        },
        addCartAdmin({ commit }, producto) {
            commit('ADD_CART_ADMIN', producto);
        },
        removeCartAdmin({ commit }) {
            const data = [];
            localStorage.setItem('carritoAdmin', data);
            commit('REMOVE_CART_ADMIN');
        },
        removeItemFromCartAdmin({ commit }, producto) {
            const data = localStorage.getItem('carritoAdmin');
            let carrito = JSON.parse(data);

            for (let index = 0; index < carrito.length; index++) {
                const element = carrito[index];
                if (element.id == producto.id) {
                    carrito = carrito.filter((e) => e != element);
                    localStorage.setItem('carritoAdmin', JSON.stringify(carrito));
                }
            }

            if (this.state.carritoAdmin.find((e) => e.id == producto.id)) {
                commit('REMOVE_ITEM_FROM_CART_ADMIN', producto);
            }
        },
        changeStateDialogTrue({commit}){
            commit('CHANGE_STATE');
        },
        changeStateDialogFalse({commit}){
            commit('CHANGE_STATE_FALSE')
        }

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

        ADD_CART_ADMIN(state, producto) {
            state.carritoAdmin.push(producto);
        },
        REMOVE_CART_ADMIN(state) {
            state.carritoAdmin = [];
        },
        REMOVE_ITEM_FROM_CART_ADMIN(state, producto) {
            state.carritoAdmin = state.carritoAdmin.filter((e) => e.id != producto.id);
        },
        CHANGE_STATE(state){
            state.dialog = true
        },
        CHANGE_STATE_FALSE(state){
            state.dialog = false
        }
    },
});

export default store;
