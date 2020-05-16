<template>
  <div class="home">
    <v-carousel
    cycle
    height="100%"
    width="100%"
    hide-delimiter-background
    :show-arrows="false"
  >
    <v-carousel-item
      v-for="(item, index) in slides"
      :key="index"
      :src= "item.src"
    >
    </v-carousel-item>
  </v-carousel>
  </div>
</template>
<script>
export default{
  data(){
    return {
      slides: [
        {
          src: '/img/delebritex.jpeg',
        },
        {
          src: '/img/faro.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        },
        ],
      }
  }
}
</script>
<style lang="scss">

</style>