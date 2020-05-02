<template>
<div id="app">
  <b-navbar class="bg-dark" toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">Delebritex</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/">Inicio</b-nav-item>
        <b-nav-item to="/about">Contacto</b-nav-item>
        <b-nav-item to="/agregarProductos">Nuevo Producto</b-nav-item>
        <b-nav-item to="/catalogo">Catalogo</b-nav-item>
        <b-nav-item to="/productos">Listado</b-nav-item>
        <b-nav-item><b-icon icon="bag"></b-icon></b-nav-item>
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="¿Qué estas buscando?"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Buscar</b-button>
        </b-nav-form>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>Usuario</em>
          </template>
          <b-dropdown-item to="#">Compras</b-dropdown-item>
          <b-dropdown-item to="#">Cerrar sesión</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <router-view/>
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

