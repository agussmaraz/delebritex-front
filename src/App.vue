<template>
  <div id="app">
    <Navigation></Navigation>
  </div>
</template>
<script>
import Navigation from './components/Navigation.vue';

export default {
  components: {
    'Navigation': Navigation
  }
}
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

