import axios from 'axios';
import Vue from 'vue';

const state = () => {
    return {
        productos: [],
        filtro: {
            productos: [],
        },
        medida: [],
        empaques: [],
        categorias: [],
       mensaje: {color: '', texto: ''}
    };
};

const getters = {};

const actions = {
    getProducts({ commit }) {
        axios.get('/producto').then((res) => {
            const productos = res.data;
            commit('SET_PRODUCTS', productos);
            commit('SET_FILTER', productos);
        });
    },
    findProduct({ commit, state }, producto) {
        const resultados = state.productos.filter((elemento) => {
            if (elemento.nombre.toLowerCase().includes(producto)) {
                return elemento;
            }
        });
        commit('SET_FILTER', resultados);
    },
    removeQuantity({ commit, state }, producto) {
        let producto_de_estado = state.productos.find((e) => e.id == producto.id);
        if (producto_de_estado) {
            commit('REMOVE_QUANTITY', { producto: producto_de_estado, cantidad: producto });
        }
    },
    listarMedidas({ commit }) {
        axios.get('/buscarMedida').then((res) => {
            const medidas = res.data.map((medida) => {
                return medida.medida;
            });
            commit('MEDIDAS', medidas);
        });
    },
    listarBultos({ commit }) {
        axios.get('/empaqueBuscar').then((res) => {
            const bultos = res.data.map((bultos) => {
                return bultos.nombre;
            });
            commit('BULTOS', bultos);
        });
    },
    listarCategorias({ commit }) {
        axios.get('/categoriaBuscar').then((res) => {
            const categorias = res.data.map((categoria) => {
                return categoria.nombre;
            });
            commit('CATEGORIAS', categorias);
        });
    },
    newProduct({ commit }, data) {
        axios
            .post('/nuevoProducto', data)
            .then((res) => {
                const mensaje = 'El producto fue agregado correctamente';
                const color = 'success';
                commit('SET_MENSAJE', [mensaje, color]);
            })
            .catch((e) => {
                const mensaje = e.response.data.mensaje;
                const color = 'danger';
                commit('SET_MENSAJE', [mensaje, color]);
            });
    },
};

const mutations = {
    // en la mutacion traigo lo que voy a necesitar, en este caso el estado y los productos
    SET_PRODUCTS(state, productos) {
        // y aca guardo en estado.producto, los productos que traje antes
        state.productos = productos;
    },
    // guardamos en el estado todos los productos
    SET_FILTER(state, resultados) {
        state.filtro.productos = resultados;
    },
    REMOVE_QUANTITY(state, objeto) {
        const estado = objeto['producto'];
        const cantidad = objeto['cantidad'];
        if (cantidad.empaques > 0 && cantidad.totalUnidad > 0) {
            estado.totalUnidad = estado.totalUnidad - Number(cantidad.unidadPorEmpaque);
            estado.totalUnidad = estado.totalUnidad - Number(cantidad.totalUnidad);
        } else if (cantidad.empaques > 0) {
            estado.totalUnidad = estado.totalUnidad - Number(cantidad.unidadPorEmpaque);
        } else if (cantidad.totalUnidad > 0) {
            estado.totalUnidad = estado.totalUnidad - Number(cantidad.totalUnidad);
        } else if (cantidad.unidades > 0) {
            estado.totalUnidad = estado.totalUnidad - Number(cantidad.unidades);
        }
    },
    MEDIDAS(state, medidas) {
        state.medida = medidas;
    },
    BULTOS(state, bultos) {
        state.empaques = bultos;
    },
    CATEGORIAS(state, categorias) {
        state.categorias = categorias;
    },
    SET_MENSAJE(state, [mensaje, color]) {
        state.mensaje.texto = mensaje;
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
