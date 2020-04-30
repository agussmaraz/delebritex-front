<template>
    <div>
        <form class="form-login" @submit.prevent="loguearUsuario(usuario)">
            <h1>Login</h1>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input type="email" class="form-control" v-model="usuario.email" />
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" v-model="usuario.contraseña" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                usuario: {
                    email: '',
                    contraseña: '',
                },
            };
        },
        methods: {
            loguearUsuario() {
                this.axios.post('/login', this.usuario).then((res) => {
                    localStorage.setItem('usertoken', res.data.token)
                    this.email = '',
                    this.contraseña = ''
                });
            },
        },
    };
</script>

<style>
    .form-login {
        width: 30%;
        margin: 0 auto;
    }
</style>
