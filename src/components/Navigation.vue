<template>
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
        <li><router-link class="links" to="/register">Registro</router-link></li>
        <li><router-link class="links" to="/login">Iniciar sesion</router-link></li>


      </ul>
    <router-view/>
    </nav>
</template>
<script>
export default {
    name: 'Navigation'
}
</script>
<style lang="scss">
nav{
  margin: 0;
  padding: 0;
  height: 10vh;
  width: 100%;
  background: #5b78c7;
}

li{
  list-style: none;
}

.nav-links{
  display: flex;
  list-style: none;
  background: coral;
  width: 50%;
  height: 100%;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  margin-left: auto;
}

.links{
  color: white;
  text-decoration: none;
  font-size: 16px;
}
@media(max-width: 768px)  {
  .nav-links{
    position: fixed;
    background: #5b78c7;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    // display: none;
  }
}
</style>