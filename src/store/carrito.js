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
                email: pedido[1][0].usuario.email,
                fecha: new Date(pedido[1][0].createdAt).toLocaleDateString(),
                estado: pedido[1][0].estado,
                productos: pedido[1],
            };
            if (buffer.estado == 1) {
                buffer.estado = 'Nuevo';
            } else if (buffer.estado == 3) {
                buffer.estado = 'Rechazado';
            } else if(buffer.estado == 5){
                buffer.estado = 'Preparando'
            }
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
    changeState({ commit, getters }, carrito) {
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '5' });
        const resultado = getters.productosPorCarrito.find((e) => e.numeroCompra == carrito.numeroCompra);
        commit('CHANGE_STATE', [resultado, 5]);
    },
    newMovement({ commit, getters }, carrito) {
        axios.post('/movimiento', carrito);
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '10' });
        const resultado = getters.productosPorCarrito.find((e) => e.numeroCompra == carrito.numeroCompra);
        commit('CHANGE_STATE', [resultado, 10]);
    },
    reject({ commit, getters }, carrito) {
        axios.put(`/carrito/${carrito.numeroCompra}`, { estado: '3' });
        const resultado = getters.productosPorCarrito.find((e) => e.numeroCompra == carrito.numeroCompra);
        commit('CHANGE_STATE', [resultado, 3]);
    },
};

const mutations = {
    GET_CART(state, carrito) {
        state.lista = carrito;
    },
    CHANGE_STATE(state, [resultado, estado]) {
        resultado.estado = estado;
        // console.log(resultado);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
