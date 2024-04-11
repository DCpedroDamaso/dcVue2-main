<script>
import AuthService from '@/auth/service/Auth.js';
import AutorizacionArbolAtributoService from '@/app/compras/mantenimientos/busqueda/autorizacionArbol/services/AutorizacionArbolService.js';
import loader from '@/commons/vue/loader.vue';
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

export default {
  data() {
    return {
        isLoading:true,
        descripcionesPorAprobar:{},
        descripcionesAprobadas:[],
        descripcionesPorAprobarBackup:{},
        palabraSearch:"",
        sortBy: [{ key: 'calories', order: 'asc' }],
        headers: [
          { title: 'Item', key: 'Item'},
          { title: 'Linea', key: 'Linea' },
          { title: 'Familia', key: 'Familia' },
          { title: 'Subfamilia', key: 'Subfamilia' },
          { title: 'Nombre', key: 'Nombre' },
          { title: 'Email', key: 'Email' },
          { title: 'Asignar', key: 'Asignar' },
          { title: 'Eliminar', key: 'iron' },
        ],
        desserts:[]
    }
  },
  components:{
    loader
  },
  methods:{
    async aprobarDescripciones(theme){
      //Aprueba la descricion para que cambie su estados en el arbol
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
        const res=await AutorizacionArbolAtributoService.updateArbolDescripciones(this.descripcionesAprobadas);
        if (res.err) {
        showErrorModal("Ha ocurrido un error",theme)
        return;
        }
        showSuccessModal("Aprobado con exito",theme);
        this.isLoading=true;
        const response = await AutorizacionArbolAtributoService.getAbolAtributosPorAprobar();
        this.isLoading=false;
        this.descripcionesPorAprobar=response;
        this.descripcionesPorAprobarBackup=response;
        this.palabraSearch=""
    },    
    filtrarDatos(){
      //se utiliza en el input para buscar
			if (this.palabraSearch.length == 0) {
			this.descripcionesPorAprobar = this.descripcionesPorAprobarBackup
			 } else {
        const arr= Object.keys(this.descripcionesPorAprobarBackup).filter((key) => key.includes(this.palabraSearch.toUpperCase()))
        console.log(arr)
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
    //carga los atributos que se tienen que aprobar
    const response = await AutorizacionArbolAtributoService.getAbolAtributosPorAprobar();
    this.isLoading=false;
    this.descripcionesPorAprobar=response;
    this.descripcionesPorAprobarBackup=this.descripcionesPorAprobar
    for (const key in this.descripcionesPorAprobar) {
        const valueArray = this.descripcionesPorAprobar[key];
        for (const value of valueArray) {
        }
        this.desserts.push({
          'Item':key.split("/")[0],
          'Familia':valueArray[0],
          'Subfamilia':valueArray[1],
          'Nombre':valueArray[2],
          'Email':valueArray[3],
          'Asignar':valueArray[4],
          'Eliminar':valueArray[5],
        })
    }
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
          <div class="text-h7 pa-2 content">Autorizar árbol</div>
        </v-card-title>

        <div class=" pa-5">
          <div v-if="isLoading" style="text-align:center;">
                <loader />
            </div>
           <div v-else>
            <v-btn @click="aprobarDescripciones(theme.global.name.value)"  variant="outlined" color="blue" align-end>
                    Aprobar
              </v-btn>
              <v-text-field @input="filtrarDatos" v-model="palabraSearch" type="text"
												placeholder="Buscar..."></v-text-field>
             <v-table class="table table-striped table-sm table-bordered table-hover">
               <thead class="stylish-color">
                    <tr>
                      <th>Item</th>
                        <th>Linea</th>
                        <th>Familia</th>
                        <th>Subfamilia</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Asignar</th>
                        <!-- <th>Eliminar</th> -->
                      </tr>
                </thead>
                <tbody>
                    <tr v-for="(key,value) in descripcionesPorAprobar" :key="key">
                      <td>{{ value.split("/")[0] }}</td>
                      <td>{{ key[0]}}</td>
                        <td>{{ key[1]}}</td>
                        <td>{{ key[2]}}</td>
                        <td>{{ key[3]}}</td>
                        <td>{{ key[4]}}</td>
                        <td>
                          <v-checkbox
                          v-model="descripcionesAprobadas"
                          :value="[value,'A']"
                          ></v-checkbox>
                        </td>
                        <!-- <td>
                          <v-btn >
                            <v-icon icon="mdi-close"></v-icon>
                          </v-btn>
                        </td> -->
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