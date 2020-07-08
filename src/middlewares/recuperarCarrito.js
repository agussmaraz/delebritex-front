import store from '../store';

export default (to, from, next) => {
    // localStorage.removeItem('carrito')
    const data = localStorage.getItem('carrito');
    if (store.state.carritos.carrito.length == 0) {
        if (data) {
            const carrito = JSON.parse(data);
            for (let index = 0; index < carrito.length; index++) {
                const element = carrito[index];
                store.state.carritos.carrito.push(element);
            }
        }
    }
    next();
};
