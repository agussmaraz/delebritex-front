<template>
  <div class="container">
    <nav>
      <div class="hamburger">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <ul class="nav-links">
        <li><router-link class="links" to="/">Home</router-link></li>
        <li><router-link class="links" to="/about">About</router-link></li>
        <li><router-link class="links" to="/usuario">Usuarios</router-link></li>
        <li><router-link class="links" to="/agregarProductos">Agregar</router-link></li>
        <li><router-link class="links" to="/productos">Productos</router-link></li>
      </ul>
    </nav>
    <router-view/>
  </div>
</template>
<script>
export default {
    name: 'Navigation'
}
</script>
<style lang="scss">

nav{
  height: 10vh;
  background: #5b78c7;
}

li{
  list-style: none;
}

.nav-links .links {
  color: white;
  text-decoration: none;
  font-size: 16px;
}
</style>