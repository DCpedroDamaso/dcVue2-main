<script>
import DiccionarioService from '@/app/compras/mantenimientos/busqueda/diccionario/services/DiccionarioService.js';
import busquedaService from '@/app/compras/mantenimientos/busqueda/criterios/services/BusquedaService'
import {groupBy, partition, map, countBy} from 'lodash';
import draggable from 'vuedraggable';
import cardItem from '@/app/compras/mantenimientos/busqueda/diccionario/components/cardItem.vue';
import loader from '@/commons/vue/loader.vue'; 
import {deburr} from 'lodash';
import Swal from 'sweetalert2';
function showErrorModal(mensaje, theme) {
    Swal.fire({
        color: theme == "dark" ? '#F5F5F5' : '#212121',
        background: theme != "dark" ? "#F5F5F5" : "#212121",
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
    });
}
function showSuccessModal(mensaje, theme) {
    Swal.fire({
        color: theme == "dark" ? '#F5F5F5' : '#212121',
        background: theme != "dark" ? "#F5F5F5" : "#212121",
        icon: 'success',
        title: 'Exito',
        text: mensaje,
    });
}
export default{
        components:{
          loader,
          draggable,
          cardItem,
        },
        data(){
          return{
            dialog: false,
            allItems:[],
            items:[],
            articulos:[],
            totalArticulos:0,
            isLoading:false,
            sinonimos:[],
            totalSinonimos:[],
            palabraBuscada:'',
            countKeywords:0,
            countSinonimos:0,
            countMatchmultiple:0,
          }
        },
        props:{
            keyword: String,
            icon:String,
            pins:Array,
            sinonimos:Array,
        },
        methods:{
          
            async getItems(keyword,sinonimos){
              this.countKeywords =0;
            this.countSinonimos = 0;
            this.countMatchmultiple = 0
              this.palabraBuscada=keyword
                this.isLoading=true;
                const resItemsDescripcion =  await DiccionarioService.getItems(keyword);
                this.isLoading=false;
                this.articulos =resItemsDescripcion.data.hits[0].sourceAsMap.items

                    this.totalSinonimos={}
                sinonimos.forEach((sinonimo)=>{
                    this.totalSinonimos={
                        ...this.totalSinonimos,
                        [sinonimo]:0
                    }
                })
                this.totalArticulos = this.articulos.length
                this.articulos.forEach((articulo)=>{
                      sinonimos.forEach((sinonimo)=>{
                    if(deburr(articulo.descripcion.toUpperCase()).includes(sinonimo) && !deburr(articulo.descripcion.toUpperCase()).includes(keyword.trim())){
                        this.totalSinonimos[sinonimo] = this.totalSinonimos[sinonimo] +1
                    }
                    if(deburr(articulo.descripcion.toUpperCase()).includes(sinonimo) && deburr(articulo.descripcion.toUpperCase()).includes(keyword.trim())){
                      this.countKeywords++
                      this.countMatchmultiple++
                    }

                })
                if(deburr(articulo.descripcion.toUpperCase()).includes(keyword.trim())){
                      this.countKeywords++
                    }
              });
              console.log(this.totalSinonimos)
            }
        },
        mounted() {
          console.log(this.pins)
          this.pins.map((pin)=> {console.log(pin['itemNum'])})
      },

    }
</script>

<template>
    <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          @click="getItems(keyword,sinonimos)"
          variant="outline">
          <v-icon :icon="icon"></v-icon> 
          Probar Regla
        </v-btn>
      </template>

      <v-card style="margin: 40px;" max-width="1000">
        <v-card-text >
            <loader v-if="isLoading"/>
              <v-row v-else class="d-flex justify-center mb-5 mt-5">
                <v-col cols="5" v-if="sinonimos.length==0" class="d-flex justify-center align-self-center">
                    <div v-if="palabraBuscada!==''">
                        <h5>Palabra: </h5>
                        <v-chip style=" display: inline-block;" class='bg-yellow-darken-1  rounded pa-1 text-black'>{{ palabraBuscada }} ({{ countKeywords }})</v-chip>
                    </div>
                </v-col>
                <v-card cols="7" style="width:600px; border:1px solid rgb(128, 128, 128);" v-if="sinonimos.length!=0" class="d-flex justify-center">
                    <v-row class="d-flex justify-center justify-space-between">
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Palabra : </h5>
                            <v-chip style="display: inline-block;" class='bg-yellow-darken-1  rounded pa-1 text-black'>{{ palabraBuscada.toUpperCase() }} ({{countKeywords}})</v-chip>
                        </div>
                    </v-col>
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Sinonimos: ({{ countSinonimos }})</h5>
                        <v-chip  v-for="(cantidad, nombre) in totalSinonimos" :key="nombre" style=" display: inline-block;" class='bg-pink-lighten-1 rounded pa-1 text-black mr-1' >{{ nombre }} ({{ cantidad }})</v-chip>
                        
                    </div>

                    </v-col>
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Match multiple: </h5>
                            <v-btn variant="outlined" color="green-lighten-2"  style="cursor: default">
                                {{ countMatchmultiple }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
                </v-card>


              </v-row>
              <div style="display:flex;flex-flow:row wrap;flex-basis:80%; justify-content:center">
                <div v-for="articulo in articulos" style="width:220px;">
                  <cardItem :articulo="articulo" :palabraBuscada="keyword" :sinonimos="sinonimos" :pins=" this.pins.map((pin)=> pin['itemNum'])" />
                </div>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" block @click="dialog = false" variant="outlined">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
</style>