import axios from 'axios';

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
                fecha: pedido[1][0].createdAt,
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
        axios.get('carrito').then((res) => {
            const carrito = res.data;
            commit('GET_CART', carrito);
        });
    },
};

const mutations = {
    GET_CART(state, carrito) {
        state.lista = carrito;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
