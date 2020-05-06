import Vue from 'vue';
import Vuex from 'vuex';
import { LayoutPlugin } from 'bootstrap-vue';
import axios from 'axios'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: null,
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
        loginWithToken({commit}){
            const data = localStorage.getItem('usertoken');
            if(data){
                const usuario = JSON.parse(data);
                const token = usuario['token']
                axios.get(`http://localhost:3000/usuario/token/${token}`).then(res => {
                    const usuarioToken = res.data
                    commit('SET_USER', usuarioToken)
                })
            }
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
    },
});

export default store;
