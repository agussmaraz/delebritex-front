<template>
    <div class="usuario">
        <h1>Hola {{ usuario.nombre }}</h1>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                usuario: '',
            };
        },
        created() {
            this.listarUsuario();
        },
        methods: {
            listarUsuario() {
                const usuarios = localStorage.getItem('usertoken');
                const objeto = JSON.parse(usuarios);
                const id = objeto['id'];
                this.axios.get(`/usuario/${id}`).then(res => {
                    this.usuario = res.data;
                })
            },
        },
    };
</script>

<style>
    .usuario {
        margin: 2%;
    }
</style>
