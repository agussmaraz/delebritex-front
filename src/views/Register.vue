<template>
    <div>
        <form class="form-register" @submit.prevent="registrarUsuario(usuario)">
            <h1>Registro</h1>
            <br />
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-control" v-model="usuario.nombre" />
            </div>
            <div class="form-group">
                <label>Apellido</label>
                <input type="text" class="form-control" v-model="usuario.apellido"/>
            </div>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input type="email" class="form-control" v-model="usuario.email"/>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="usuario.contraseña"/>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                usuario: {
                    nombre: '',
                    apellido: '',
                    email: '',
                    contraseña: '',
                }
            }
        },
        methods: {
            registrarUsuario(){
                this.axios.post('/register', this.usuario).then((res) => {
                    this.usuario.nombre = '';
                    this.usuario.apellido = '';
                    this.usuario.email = '';
                    this.usuario.contraseña = '';
                    this.usuario.push(res.data);
                })
            }
        }
    };
</script>

<style>
    .form-register {
        width: 30%;
        margin: 0 auto;
    }
</style>
