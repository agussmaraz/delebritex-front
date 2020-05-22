<template>
    <div>
        <v-app>
        <v-card>
            <div class="tamaño d-block font-weight-light">Nuestra historia</div>
        </v-card>
  <v-timeline>
    <v-timeline-item
      v-for="(year, i) in years"
      :key="i"
      :color="year.color"
      small
    >
      <template v-slot:opposite>
        <span
          :class="`display-1 font-weight-bold ${year.color}--text `"
          v-text="year.year"
        ></span>
      </template>
      <div class="py-4">
        <div>
          {{year.text}}
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
        <br />
        <v-card
        max-height="100%"
        max-width="100%"
        >
            <v-card-title class="d-block">Un poco mas de nosotros.</v-card-title>
            <v-card-text>Somos una Pyme familiar , con más de 10 años de trayectoria que se ha dedicado a lo largos de estos años a la distribución de productos textiles para el hogar, brindando un servicio de precio Justo en relación a la calidad de todos nuestros artículos y a la eficacia de entrega y organización sistemática que nos proponemos lograr con cada uno de nuestros clientes . La experiencia obtenida nos hace ser un equipo de trabajo consolidado, con un reparto de pronta entrega y excelente coordinación ; además nos ocupamos de estar siempre en la búsqueda de brindar un mejor servicio con la misma calidad y compromiso que nos caracteriza y forma la base nuestra pequeña gran empresa.</v-card-text>
        </v-card>
        </v-app>
    </div>
</template>

<script>
    export default {
    data: () => ({
      years: [
        {
          color: 'cyan',
          year: '2010',
          text: 'Fundamos nuestra empresa familiar',
        },
        {
          color: 'cyan',
          year: '2015',
          text:'Algo para poner'
        },
        {
          color: 'cyan',
          year: '2020',
          text: 'Continuamos con nuestro trabajo en esta epoca de pandemia para todos nuestros clientes'
        },
      ],
    }),
    }
</script>

<style>
    .tamaño {
        font-size: 3rem;
    }
</style>
