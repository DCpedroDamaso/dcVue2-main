<script>
import AuthService from '@/auth/service/Auth.js';
import AutorizacionAtributoService from '@/app/compras/mantenimientos/busqueda/autorizacionAtributo/services/AutorizacionAtributoService.js';
import loader from '@/commons/vue/loader.vue';
import Swal from 'sweetalert2';

function showErrorModal(mensaje, theme) {
//cambio
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
export default {
  data() {
    return {
        isLoading:true,
        descripcionesPorAprobar:{},
        descripcionesPorAprobarBackup:{},
        descripcionesAprobadas:[],
        palabraSearch:'',
        
    }
  },
  components:{
    loader
  },
  methods:{
    async aprobarDescripciones(theme){
      //aprueba las decripciones por atributos de los items
      console.log(this.descripcionesAprobadas.length)
      if (this.descripcionesAprobadas.length==0){
        showErrorModal("No hay ningun elemento seleccionado",theme);
        return
      }
			const segundaValidacion = await Swal.fire({
				title: 'Estas seguro de quieres Aprobar?',
				text: "Esta por Aprobar",
				icon: 'info',
				color: theme == "dark" ? '#F5F5F5' : '#212121',
				background: theme != "dark" ? "#F5F5F5" : "#212121",
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, aprobar'
			});
      if (segundaValidacion.isDismissed) {
				return;
			}
        const res=await AutorizacionAtributoService.updateDescripciones(this.descripcionesAprobadas);
        if (res.err) {
        showErrorModal("Ha ocurrido un error",theme)
        return;
        }
        showSuccessModal("Aprobado con exito",theme);
        this.isLoading=true;
        const response = await AutorizacionAtributoService.getDescripcionesPorAprobar();
        this.isLoading=false;
        this.descripcionesPorAprobar=response;
        this.descripcionesPorAprobarBackup=response;
        this.palabraSearch=""
    },
    filtrarDatos(){
      //el metodo lo uitliza el imput para buscar por item
			if (this.palabraSearch.length == 0) {
			this.descripcionesPorAprobar = this.descripcionesPorAprobarBackup
			  } else {
        const arr= Object.keys(this.descripcionesPorAprobarBackup).filter((key) => key.includes(this.palabraSearch.toUpperCase()))
			  let descripcionesPorAprobarHelper={}
        arr.forEach((_a)=>{
          descripcionesPorAprobarHelper={
            ...descripcionesPorAprobarHelper,
            [_a]: this.descripcionesPorAprobarBackup[_a.toString()]
          } 
          
        })
        this.descripcionesPorAprobar=descripcionesPorAprobarHelper
    }
    }
  },
  async mounted() {
    //pide los atributos que hay que aprobar para mostrarlos
    const response = await AutorizacionAtributoService.getDescripcionesPorAprobar();
    this.isLoading=false;
    this.descripcionesPorAprobar=response;
    this.descripcionesPorAprobarBackup=response;
    if (response.err) {
        showErrorModal("Ha ocurrido un error","dark")
        return;
    }
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #body>
      <v-card class="sombra ma-5" elevation="15">
        <v-card-title  class="bg-grey-darken-3 d-flex align-center">
                    <v-icon icon="mdi-book-open-page-variant" size="large"></v-icon>
          <div class="text-h7 pa-2 content">Autorizar Atributos</div>
        </v-card-title>

        <div class=" pa-5">
            <div v-if="isLoading" style="text-align:center;">
                <loader />
            </div>
            <div v-else>


            <v-btn  @click="aprobarDescripciones(theme.global.name.value)"  variant="outlined" color="blue" align-end>
                    Aprobar
                </v-btn>
                <v-text-field @input="filtrarDatos" v-model="palabraSearch" type="text"
												placeholder="Buscar..."></v-text-field>
            <v-table class="table table-striped table-sm table-bordered table-hover">
                <thead class="stylish-color">
                    <tr>
                        <th>Item</th>
                        <th>Atributo</th>
                        <th>Descripcion</th>
                        <th>Aprobar</th>

                    </tr>
                </thead>
                <tbody>
                  <tr v-for="(key,value) in descripcionesPorAprobar" :key="key">
                      
                        <td >{{ value.split("/")[0] }}</td>
                        <td>{{ key[0]}}</td>
                        <td>{{ key[1]}}</td>
                        <td>
                          <v-lazy> 
                          <v-checkbox
                        v-model="descripcionesAprobadas"
                        :value="[value,key[0],key[1]]"
                        ></v-checkbox>
                      </v-lazy>
                      </td>
                    </tr>
                </tbody>
            </v-table>
          </div>
        </div>
      </v-card>
    </template>
  </NuxtLayout>
</template>

<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();
definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      const isAuth = AuthService.isTokenValid();
      if (!isAuth) {
        return navigateTo('/compras/mantenimientos/busquedas/login');
      }
    },
  ]
});
</script>