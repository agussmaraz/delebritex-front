<template>
    <div>
        <h1>Registro</h1>
        <template>
            <v-form ref="form" @submit.prevent="registrarUsuario()">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="4" class="mx-auto">
                            <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
                            <v-text-field v-model="usuario.nombre" label="Nombre" required></v-text-field>
                            <p v-if="error" class="error-register">{{ this.error.nombre }}</p>

                            <v-text-field v-model="usuario.apellido" label="Apellido" required></v-text-field>
                            <p v-if="error" class="error-register">{{ this.error.apellido }}</p>

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
            // Validaciones de registro
            validarRegistro() {
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
            },
            // Registrar al usuario llamando las validaciones y giardar el token en localStorage
            registrarUsuario() {
                this.validarRegistro();
                this.axios
                    .post('/register', this.usuario)
                    .then((res) => {
                        const payload = {
                            id: res.data.id,
                            token: res.data.token,
                            estado: res.data.estado,
                        };
                        localStorage.setItem('usertoken', JSON.stringify(payload));
                        this.setUser(res.data)

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
            ...mapActions({
                setUser: 'setUser',
            }),
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
