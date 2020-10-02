<template>
    <div>
        <h1>Iniciar Sesion</h1>
        <template>
            <v-form ref="form" @submit.prevent="loguearUsuario()">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="4" class="mx-auto">
                            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>

                            <v-text-field v-model="usuario.email" label="E-mail" required></v-text-field>
                            <p v-if="error" class="error-register">{{ this.error.email }}</p>

                            <v-text-field type="password" v-model="usuario.contraseña" label="Contraseña" required></v-text-field>
                            <p v-if="error" class="error-register">{{ this.error.contraseña }}</p>
                        </v-col>
                    </v-row>
                    <button type="submit">Enviar</button>
                </v-container>
            </v-form>
        </template>
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
            // funcion para validar los datos del form 
            validacionesLogin() {
                this.error = {};
                if (!this.usuario.email) {
                    const email = 'El email es obligatorio';
                    this.error.email = email;
                }
                if (!this.usuario.contraseña) {
                    const contraseña = 'El contraseña es obligatorio';
                    this.error.contraseña = contraseña;
                }
                // console.log(this.error);
                if (!this.error) {
                    return true;
                }
            },
            // Loguear al usuario y gardar en el localStorage el token y el id del usuario
            loguearUsuario() {
                this.validacionesLogin();
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
                        this.$router.push({ name: 'Index' });
                    })
                    .catch((e) => {
                        this.mensaje.color = 'danger';
                        this.mensaje.texto = e.response.data.mensaje;
                        this.showAlert();
                    });
            },
            //Funciones para el alert de bootstrap
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
