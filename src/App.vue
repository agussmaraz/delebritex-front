<template>
    <div id="app">
        <div>
            <b-navbar toggleable="lg" type="dark" variant="info">
                <b-navbar-brand to="/">NavBar</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/">home</b-nav-item>
                        <b-nav-item to="/about">about</b-nav-item>
                        <b-nav-item to="/agregarProductos">agregar</b-nav-item>
                        <b-nav-form>
                            <b-form-input size="sm" class="mr-sm-2" placeholder="¿Qué estas buscando?"></b-form-input>
                            <b-button size="sm" class="my-2 my-sm-0" type="submit">Buscar</b-button>
                        </b-nav-form>
                        <b-nav-item-dropdown right>
                            <!-- Using 'button-content' slot -->
                            <template v-slot:button-content>
                                <em>User</em>
                            </template>
                            <b-dropdown-item to="/usuario">Profile</b-dropdown-item>
                            <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
            <router-view />
        </div>
    </div>
</template>
<script>
  
</script>
<style lang="scss">
    #app {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Source Sans Pro', sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
