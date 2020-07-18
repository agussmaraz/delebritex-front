import store from '../store';

export default (to, from, next) => {
    localStorage.removeItem("carritoAdmin")
    const data = localStorage.getItem('carritoAdmin');
    if (store.state.carritoAdmin.length == 0) {
        if (data) {
            const carritoAdmin = JSON.parse(data);
            for (let index = 0; index < carritoAdmin.length; index++) {
                const element = carritoAdmin[index];
                store.state.carritoAdmin.push(element);
            }
        }
    }
    next();
};
