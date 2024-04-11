<script>
import carta from './cartaArticulo.vue';

export default {
  name: 'tabla',
  components: {
    carta
  },
  props: {
    articulos: Array
  },
  data() {
    return {
      items: []
    }
  },
  methods: {
    getImgUrl(articulo) {
      return `https://pedidos.com/myfotos/large/(L)${articulo}.jpg`;
    },
  },
  mounted() {
    this.items = this.articulos.slice()
  }

}
</script>
<template>
  <div class="container">

    <div class="row grid-cards">
        <carta v-for="element in items" :item="element"/>
    </div>
  </div>
</template>

<style>
  .grid-cards{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
  }
</style>