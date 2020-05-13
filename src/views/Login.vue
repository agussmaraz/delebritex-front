<template>
    <div>
        <form class="form-login" @submit.prevent="loguearUsuario(usuario)">
            <h1>Login</h1>
            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input type="email" class="form-control" v-model="usuario.email" />
                <p v-if="error" class="error-login">{{ this.error.email }}</p>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" v-model="usuario.contraseña" />
                <p class="error-login">{{ this.error.contraseña }}</p>
            </div>
            <button type="submit" class="btn btn-primary">Entrar</button>
        </form>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import router from '../router';
    export default {
        data() {
            return {
                usuario: {
                    email: '',
                    contraseña: '',
                },
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
                error: {},
            };
        },
        computed: {
            ...mapState({
                user: (state) => state.user,
            }),
            ...mapGetters({
                isLogged: 'isLogged',
                isAdmin: 'isAdmin',
            }),
        },
        methods: {
            ...mapActions({
                setUser: 'setUser',
            }),
            loguearUsuario() {
                this.error = {};
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
                    .post('/login', this.usuario)
                    .then((res) => {
                        const payload = {
                            id: res.data.id,
                            token: res.data.token,
                        };
                        this.setUser(res.data);
                        localStorage.setItem('usertoken', JSON.stringify(payload));
                        this.usuario.email = '';
                        this.usuario.contraseña = '';
                        this.$router.push({ name: 'Home' });
                    })
                    .catch((e) => {
                        // console.log(e.response.data.mensaje);
                        this.mensaje.color = 'danger';
                        this.mensaje.texto = e.response.data.mensaje;
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
    .form-login {
        width: 30%;
        margin: 0 auto;
    }
    .error-login {
        color: red;
    }
</style>
