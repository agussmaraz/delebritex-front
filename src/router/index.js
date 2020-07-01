import Vue from 'vue';
import VueRouter from 'vue-router';
import recuperarCarrito from '../middlewares/recuperarCarrito';
import carritoAdmin from '../middlewares/carritoAdmin';

import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/contacto',
        name: 'Contacto',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Contacto.vue'),
    },
    {
        path: '/asd',
        name: 'asd',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Asd.vue'),
    },
    {
        path: '/usuario',
        name: 'Usuario',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Usuario.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/agregarProductos',
        name: 'Producto',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AgregarProductos.vue'),
    },
    {
        path: '/productos',
        name: 'Productos',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Productos.vue'),
    },
    {
        path: '/register',
        name: 'Registro',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue'),
    },
    {
        path: '/login',
        name: 'Inicio de sesion',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    },
    {
        path: '/catalogo',
        name: 'Catalogo',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Catalogo.vue'),
    },
    {
        path: '/ventaPresencial',
        name: 'ventaPresencial',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/VentaPresencial.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/quienesSomos',
        name: 'quienesSomos',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/QuienesSomos.vue'),
    },
    {
        path: '/carrito',
        name: 'carrito',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Carrito.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/historial',
        name: 'historial',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Historial.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/online',
        name: 'online',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Online.vue'),
        meta: { requiresAuth: true },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(recuperarCarrito);
router.beforeEach(carritoAdmin);

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.state.user && !localStorage.getItem('usertoken')) {
            next({
                name: 'Inicio de sesion',
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
