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
            <button type="submit" class="btn btn-primary">Entrar</button>
        </form>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import router from '../router'
    export default {
        data() {
            return {
                usuario: {
                    email: '',
                    contraseña: '',
                },
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
                setUser: 'setUser'

            }),
            loguearUsuario() {
                this.axios
                    .post('/login', this.usuario)
                    .then((res) => {
                        const payload = {
                            id: res.data.id,
                            token: res.data.token,
                        };
                        this.setUser(res.data);
                        // console.log(this.setUser);
                        localStorage.setItem('usertoken', JSON.stringify(payload));
                        this.usuario.email = '';
                        this.usuario.contraseña = '';
                        this.$router.push({name: 'Home'});
                    })
                    .catch((err) => {
                        console.log(err);
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
