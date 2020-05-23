<template>
    <div class="usuario">
        <!-- <v-app> -->
        <h1>Hola {{ usuario.nombre }}</h1>
        <h5>Estas son las compras que hiciste ultimamente</h5>
        <br />
        <v-card class="mx-auto" max-width="500" outlined>
            <v-list-item three-line v-for="(item, index) in carrito" :key="index">
                <v-list-item-content>
                    <div class="overline mb-4">{{ resetearFecha(item.createdAt) }}</div>
                    <v-list-item-title class=" mb-1">{{ item.producto }}</v-list-item-title>
                    <div class="d-flex">
                        <v-list-item-subtitle>Unidades: {{ item.unidades }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Precio: {{ item.precioTotal }}</v-list-item-subtitle>
                    </div>
                </v-list-item-content>
                <v-img class="white--text align-end" max-width="100" :src="item.imagen"> </v-img>
            </v-list-item>
            <br />
            <div class="p-usuario">
                <p>Total: {{ totalCompra }}</p>
                <p>Estado: </p>
            </div>
        </v-card>
        <!-- </v-app> -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                usuario: '',
                carrito: [],
            };
        },
        created() {
            this.listarUsuario();
            this.accederCarrito();
        },
        computed: {
            totalCompra() {
                return this.carrito.reduce((total, item) => total + Number(item.precioTotal), 0);
            },
        },
        methods: {
            listarUsuario() {
                const usuarios = localStorage.getItem('usertoken');
                const objeto = JSON.parse(usuarios);
                const id = objeto['id'];
                this.axios.get(`/usuario/${id}`).then((res) => {
                    this.usuario = res.data;
                });
            },
            accederCarrito() {
                const storage = localStorage.getItem('usertoken');
                const usuario = JSON.parse(storage);
                const id = usuario['id'];
                this.axios.get(`/carrito/${id}`).then((res) => {
                    this.carrito = res.data;
                });
            },
            resetearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style>
    .usuario {
        margin: 2%;
    }
    .p-usuario {
        display: flex;
        justify-content: space-between;
        margin-left: 14%;
        font-weight: bold;
        margin-right: 5%;
    }
</style>
