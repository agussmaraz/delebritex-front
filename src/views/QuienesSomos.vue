<template>
    <div>
        <v-card>
            <div class="tamaño d-block">Nuestra historia</div>
        </v-card>
        <br />
        <v-timeline :align-top="alignTop" :dense="dense" :reverse="reverse">
            <v-timeline-item :fill-dot="fillDot" :hide-dot="hideDot" :left="left" :right="right" :small="small">
                <!-- <span slot="opposite">Tus eu perfecto</span> -->
                <v-card class="elevation-2">
                    <v-card-title class="headline d-block">2010</v-card-title>
                    <v-card-text>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quia.
                    </v-card-text>
                </v-card>
            </v-timeline-item>
            <v-timeline-item :fill-dot="fillDot" :hide-dot="hideDot" :icon="icon ? 'mdi-star' : ''" :icon-color="iconColor ? 'deep-orange' : ''" :left="left" :right="right" :small="small">
                <!-- <span slot="opposite">Tus eu perfecto</span> -->
                <v-card class="elevation-2">
                    <v-card-title class="headline d-block">2015</v-card-title>
                    <v-card-text>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quia.
                    </v-card-text>
                </v-card>
            </v-timeline-item>
            <v-timeline-item :fill-dot="fillDot" :hide-dot="hideDot" :icon="icon ? 'mdi-star' : ''" :icon-color="iconColor ? 'deep-orange' : ''" :left="left" :right="right" :small="small">
                <!-- <span slot="opposite">Tus eu perfecto</span> -->
                <v-card class="elevation-2">
                    <v-card-title class="headline d-block">2020</v-card-title>
                    <v-card-text>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quia.
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
        <br />
        <v-card>
            <v-card-title class="d-block">Un poco mas de nosotros.</v-card-title>
            <v-card-text>Somos una Pyme familiar , con más de 10 años de trayectoria que se ha dedicado a lo largos de estos años a la distribución de productos textiles para el hogar, brindando un servicio de precio Justo en relación a la calidad de todos nuestros artículos y a la eficacia de entrega y organización sistemática que nos proponemos lograr con cada uno de nuestros clientes . La experiencia obtenida nos hace ser un equipo de trabajo consolidado, con un reparto de pronta entrega y excelente coordinación ; además nos ocupamos de estar siempre en la búsqueda de brindar un mejor servicio con la misma calidad y compromiso que nos caracteriza y forma la base nuestra pequeña gran empresa.</v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {};
</script>

<style>
    .tamaño {
        font-size: 3rem;
    }
</style>
