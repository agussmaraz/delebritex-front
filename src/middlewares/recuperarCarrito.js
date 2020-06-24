import store from '../store';

export default (to, from, next) => {
    const data = localStorage.getItem('carrito');
    if (store.state.carrito.length == 0) {
        if (data) {
            const carrito = JSON.parse(data);
            for (let index = 0; index < carrito.length; index++) {
                const element = carrito[index];
                store.state.carrito.push(element);
            }
        }
    }
    next();
};
