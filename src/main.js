import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import VueMq from 'vue-mq';
import store from './store'
import Slug from 'slug';
import Print from 'vue-print-nb'
import JsonExcel from 'vue-json-excel'
import jsPDF from 'jspdf';

Vue.use(jsPDF);

Vue.component('downloadExcel', JsonExcel)
Vue.use(Print);

Vue.use(VueMq, {
    breakpoints:{
        mobile: 450,
        tablet: 900,
        laptop: 1250,
        desktop: Infinity
    }
})

Vue.use(Slug);
Vue.use(BootstrapVueIcons);
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
    vuetify,
    store: store
}).$mount('#app');

import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify';
import slug from 'slug';
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:3000';