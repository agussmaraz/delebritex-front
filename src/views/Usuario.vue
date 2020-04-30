<template>
    <div class="usuario">
        <Titulo></Titulo>
        <h5>{{ nombre }}</h5>
        <h5>{{ email }}</h5>
    </div>
</template>

<script>
    import Titulo from '../components/Titulo';
    import jwtDecode from 'jwt-decode';
    export default {
        data() {
            const token = localStorage.usertoken;
            const decoded = jwtDecode(token);
            return {
                nombre: decoded.nombre,
                email: decoded.email,
                contraseña: decoded.contraseña
            };
        },
        components: {
            Titulo: Titulo,
        },
    };
</script>

<style>
    .usuario {
        margin: 10%;
    }
</style>
