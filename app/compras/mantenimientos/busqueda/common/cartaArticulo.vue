<script>

export default {
  name: 'carta',
  data() {
    return {
    }
  },
  methods: {
    getImgUrl(articulo) {
      return `https://pedidos.com/myfotos/large/(L)${articulo}.jpg`;
    },
    formatNumber(numero){
        return new Intl.NumberFormat('en-US').format(numero);
    }
  },
  props: {
    item: Object
  },
}
</script>

<template>

    <!-- <v-col cols="4"> -->
        <div class="card-container" style="height:300px" :title="item.articulo">
          <div class="card-content ">
            <div>
              <img :src="getImgUrl(item.articulo)" width="100">
            </div>
            <div>
              <p>Clave: {{ item.articulo }}</p>
              <p>Clasificacion: {{ item.clasificacion }}</p>
              <p>Disponibilidad: {{ formatNumber(item.disponibilidad) }}</p>
              <p>Ponderacion: {{ formatNumber(item.prioridad) }}</p>
            </div>
          </div>
        </div>
      <!-- </v-col> -->

</template>

<style>
  .card-container{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 10px;
    
  }
  .card-content{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
</style>