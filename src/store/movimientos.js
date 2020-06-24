import axios from 'axios';

const state = () => {
    return {
        lista: [],
    };
};

const getters = {
    productosPorCarrito(state) {
        const movimientos_filtrados = state.lista.filter((movimiento) => movimiento.estado !== 10);
        const pedidos = {};

        for (const key in movimientos_filtrados) {
            const movimiento = movimientos_filtrados[key];

            if (!pedidos.hasOwnProperty(movimiento.numeroCompra)) {
                pedidos[movimiento.numeroCompra] = [];
            }

            pedidos[movimiento.numeroCompra].push(movimiento);
        }

        const resultado = [];
        for (let i = 0; i < Object.entries(pedidos).length; i++) {
            const pedido = Object.entries(pedidos)[i];
            const buffer = {
                numeroCompra: pedido[0],
                usuario: pedido[1][0].usuario.nombre,
                // email: pedido[1][0].usuario.email,
                fecha: pedido[1][0].fecha,
                estado: pedido[1][0].estado,
                productos: pedido[1],
            };
            console.log(buffer)
            resultado.push(buffer);
        }

        return resultado;
    },
};

const actions = {
    getAll({ commit }) {
        axios.get('/movimientos').then((res) => {
            const movimientos = res.data;
            commit('GET_MOVIMIENTOS', movimientos);
        });
    },
};

const mutations = {
    GET_MOVIMIENTOS(state, movimientos) {
        state.lista = movimientos;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
