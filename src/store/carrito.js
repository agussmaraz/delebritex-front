import axios from 'axios';
import Vue from 'vue';

const state = () => {
    return {
        lista: [],
        carrito: [],
        mensaje: { color: '', texto: '' },
        total: '',
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
    paquetes(state) {
        return state.carrito.reduce((total, item) => total + Number(item.paquetesElegidos), 0);
    },
    cantidadesElegida(state) {
        return state.carrito.reduce((total, item) => total + Number(item.cantidadElegida), 0);
    },
 
};

const actions = {
    newCartDB({ commit, dispatch }, payload) {
       
        axios
            .post('/nuevo-carrito', payload)
            .then((res) => {
                dispatch('removeQuantityDB', payload);
                const data = 'La compra fue exitosa';
                commit('SET_MENSAJE', [data, 'success']);
                commit('REMOVE_FROM_CART');
            })
            .catch((e) => {
                const data = e.response.data.mensaje[0];
                commit('SET_MENSAJE', [data, 'danger']);
            });
    },
    addToCart({ commit, state }, producto) {
        if (!state.carrito.find((e) => e.slug == producto.slug)) {
            // llevemoslo a hacer una mutacion
            commit('ADD_TO_CART', producto);
        }
        // si en el carrito no existe este producto
    },
    removeQuantityDB({ commit, state, dispatch }, payload) {
        for (let index = 0; index < payload.length; index++) {
            const element = payload[index];
            const id = element[id];
            dispatch('productos/removeQuantity', element, { root: true });
            axios.put(`/stock/${id}`, payload);
        }
    },
    removeFromCart({ commit }) {
        const data = [];
        localStorage.setItem('carrito', data);
        commit('REMOVE_FROM_CART');
    },
    removeItemFromCart({ commit, state }, producto) {
        const data = localStorage.getItem('carrito');
        let carrito = JSON.parse(data);

        for (let index = 0; index < carrito.length; index++) {
            const element = carrito[index];
            if (element.id == producto.id) {
                carrito = carrito.filter((e) => e != element);
                localStorage.setItem('carrito', JSON.stringify(carrito));
            }
        }

        if (state.carrito.find((e) => e.id == producto.id)) {
            commit('REMOVE_ITEM_FROM_CART', producto);
        }
    },
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
    ADD_TO_CART(state, producto) {
        // en el estado, la posicion carrito le vamos a agregar este producto
        state.carrito.push(producto);
    },
    REMOVE_FROM_CART(state) {
        state.carrito = [];
    },
    REMOVE_ITEM_FROM_CART(state, producto) {
        state.carrito = state.carrito.filter((e) => e.id != producto.id);
    },
    GET_CART(state, carrito) {
        state.lista = carrito;
    },
    CHANGE_STATE(state, [numeroCompra, estado]) {
        const resultado = state.lista.find((e) => e.numeroCompra == numeroCompra);
        // Vue.set(resultado, 'estado', estado);
        resultado.estado = estado;
    },
    SET_MENSAJE(state, [data, color]) {
        // console.log(data);
        state.mensaje.texto = data;
        state.mensaje.color = color;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
