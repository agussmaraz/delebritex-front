<template>
    <div class="usuario">
        <h1>Hola </h1>
        <h5>{{ nombre }}</h5>
        <h5>{{ email }}</h5>
    </div>

</template>
<script>
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
       
    };
</script>

<style>
    .usuario {
        margin: 10%;
    }
</style>
</script>

<style>
.usuario{
  margin-top: 2%;
}
</style>
