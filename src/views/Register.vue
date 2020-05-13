<template>
    <div>
        <form class="form-register" @submit.prevent="registrarUsuario(usuario)">
            <br>
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <h1>Registro</h1>
            <br />
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-control" v-model="usuario.nombre" />
                <p v-if="error" class="error-register">{{ this.error.nombre }}</p>
            </div>
            <div class="form-group">
                <label>Apellido</label>
                <input type="text" class="form-control" v-model="usuario.apellido" />
                <p class="error-register">{{ this.error.apellido }}</p>
            </div>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input type="email" class="form-control" v-model="usuario.email" />
                <p class="error-register">{{ this.error.email }}</p>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="usuario.contraseña" />
                <p class="error-register">{{ this.error.contraseña }}</p>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</template>

<script>
    import router from '../router';
    export default {
        data() {
            return {
                usuario: {
                    nombre: '',
                    apellido: '',
                    email: '',
                    contraseña: '',
                },
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
                error: {},
            };
        },
        methods: {
            registrarUsuario() {
                this.error = {};
                if (!this.usuario.nombre) {
                    const nombre = 'El nombre es obligatorio';
                    this.error.nombre = nombre;
                }
                if (!this.usuario.apellido) {
                    const apellido = 'El apellido es obligatorio';
                    this.error.apellido = apellido;
                }
                if (!this.usuario.email) {
                    const email = 'El email es obligatorio';
                    this.error.email = email;
                }
                if (!this.usuario.contraseña) {
                    const contraseña = 'El contraseña es obligatorio';
                    this.error.contraseña = contraseña;
                }
                if (!this.error) {
                    return true;
                }
                this.axios
                    .post('/register', this.usuario)
                    .then((res) => {
                        const payload = {
                            id: res.data.id,
                            token: res.data.token,
                            estado: res.data.estado,
                        };
                        localStorage.setItem('usertoken', JSON.stringify(payload));
                        this.usuario.nombre = '';
                        this.usuario.apellido = '';
                        this.usuario.email = '';
                        this.usuario.contraseña = '';
                        this.usuario = res.data;
                        this.$router.push({ name: 'Home' });
                    })
                    .catch((err) => {
                        this.mensaje.color = 'danger';
                        this.mensaje.texto = err.response.data.mensaje;
                        this.showAlert();
                    });
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
    };
</script>

<style>
    .form-register {
        width: 30%;
        margin: 0 auto;
    }
    .error-register {
        color: red;
    }
</style>
