import axios from 'axios';
import Vue from 'vue';

const state = () => {
    return {
        lista: [],
    };
};

const getters = {
    productosPorCarrito(state) {
        const carritos_filtrados = state.lista.filter((carrito) => carrito.estado !== 10);
        const pedidos = {};
        for (const key in carritos_filtrados) {
            const carrito = carritos_filtrados[key];

            if (!pedidos.hasOwnProperty(carrito.numeroCompra)) {
                pedidos[carrito.numeroCompra] = [];
            }

            pedidos[carrito.numeroCompra].push(carrito);
        }
        const resultado = [];
        for (let i = 0; i < Object.entries(pedidos).length; i++) {
            const pedido = Object.entries(pedidos)[i];
            const buffer = {
                numeroCompra: pedido[0],
                usuario: pedido[1][0].usuario.nombre,
                email: pedido[1][0].usuario.email,
                fecha: new Date(pedido[1][0].createdAt).toLocaleDateString(),
                estado: pedido[1][0].estado,
                productos: pedido[1],
            };

            resultado.push(buffer);
        }

        return resultado;
    },
};

const actions = {
    getAll({ commit }) {
        axios.get('/carrito').then((res) => {
            const carrito = res.data;
            commit('GET_CART', carrito);
        });
    },
    changeState({ commit }, carrito) {
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '5' });

        commit('CHANGE_STATE', [carrito.numeroCompra, 5]);
    },
    newMovement({ commit }, carrito) {
        axios.post('/movimiento', carrito);
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '10' });

        commit('CHANGE_STATE', [carrito.numeroCompra, 10]);
    },
    reject({ commit }, carrito) {
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '3' });

        commit('CHANGE_STATE', [carrito.numeroCompra, 3]);
    },
};

const mutations = {
    GET_CART(state, carrito) {
        state.lista = carrito;
    },
    CHANGE_STATE(state, [numeroCompra, estado]) {
        const resultado = state.lista.find((e) => e.numeroCompra == numeroCompra);
        // Vue.set(resultado, 'estado', estado);
        resultado.estado = estado;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
