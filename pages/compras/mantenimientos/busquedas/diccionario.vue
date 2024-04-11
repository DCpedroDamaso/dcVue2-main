<script>
import AuthService from '@/auth/service/Auth.js';
import DiccionarioService from '@/app/compras/mantenimientos/busqueda/diccionario/services/DiccionarioService.js';
import ItemsDialog from '@/app/compras/mantenimientos/busqueda/diccionario/components/ItemsDialog.vue';
import Swal from 'sweetalert2';
import loader from '@/commons/vue/loader.vue';
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
      search: '',
      groupBy: [{ key: 'inicial', order: 'asc' }],
      sortBy: [{ key: 'palabra', order: 'asc' }],
      isLoading: false,
      headers: [
        { title: 'OPCIONES', key: 'ops' , sortable: false },
        { title: 'DCM/BLITZ', key: 'divCodes' },
        {
          title: 'PALABRA',
          align: 'start',
          key: 'palabra',
        },
        { title: 'PINS', key: 'pins', sortable: false },
        { title: 'CRITERIOS', key: 'criterios', sortable: false },
        { title: 'OCULTOS', key: 'excluidos', sortable: false },
        { title: 'SINONIMOS', key: 'sinonimos', sortable: false },
        { title: 'CREADO EL', key: 'fechaCreacion' },
        { title: 'CREADO POR', key: 'usuarioCreacion' },
      ],
      reglas: [],

    }
  },
  components:{
    loader,
    ItemsDialog
  },
  methods:{
    isAdmin(){
      //valida si es admin, de no ser el caso solo mostrara el boton para ver la regla
      // no permitira ni eliminarla ni editarla
			let token = localStorage.getItem("jwtToken");
			const tokenParsed = JSON.parse(atob(token.split('.')[1]));
			const puesto = tokenParsed.puesto;
			const numEmpleado= tokenParsed.numEmpleado
			if( numEmpleado =="2220" 
      || numEmpleado == "6879" 
      || numEmpleado == "3647" 
      || numEmpleado=="2071"
      ||numEmpleado=="1651"){
				return true;
			}else{
				return false;
			}
		},
    async getItems (keyword){
      // trae  los items que le pertenecen a la regla
      const response = await DiccionarioService.getItems(keyword);
      console.log(response.data)
    },
    async deleteRegla(keyword,theme){
      //Elimina la regla
      const segundaValidacion = await Swal.fire({
        title: 'Estas seguro de quieres Eliminar esta regla?',
				text: "Esta por Eliminar",
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
      this.isLoading = true
      const res=await DiccionarioService.deleteRegla(keyword);
        if (res.err) {
        showErrorModal("Ha ocurrido un error",'dark')
        return;
        }
      showSuccessModal("Eliminado con exito",'dark');
      this.init()
      this.isLoading = false

    },
    async init(){
      //inicializa las reglas que hay cargadas
      const response = await DiccionarioService.getReglas();
    this.reglas = response.data;

    this.reglas.forEach((el) => {
      el.detallePin = false;
      el.menu = false;
      el.inicial = el.palabra.charAt(0).toUpperCase();
      el.criterios.forEach(criterio => {
        if (criterio != null) {
          criterio.detalle = false
        }
        return criterio
      });
      el.excluidos.forEach(excluido =>{
        if (excluido != null) {
          excluido.detalle = false
        }
        return excluido;
      });
    });
    console.log(this.reglas)
    }
  },
  async mounted() {
    this.init()
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #body>
      <v-card class="sombra ma-5" elevation="15">
        <v-card-title  class="bg-grey-darken-3 d-flex align-center">
                    <v-icon icon="mdi-book-open-page-variant" size="large"></v-icon>
          <div class="text-h7 pa-2 content">Diccionario</div>
        </v-card-title>

        <div class=" pa-5">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-data-table :headers="headers" :items="reglas" item-value="name" class="elevation-1" :search="search"
          >  
          <!-- :group-by="groupBy"> -->
            <template v-slot:item="{ item }">
              <tr>
                <td>

                  <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-btn variant="plain" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                    </template>

                    <v-list>
                      <v-list-item color="primary" rounded="shaped">
                        <!-- <template v-slot:prepend><v-icon icon="mdi-flask"></v-icon></template> -->
                        <!-- <v-list-item-title> </v-list-item-title> -->
                        <!-- <v-btn @click="getItems(item.columns.palabra)" ><v-icon icon="mdi-flask"></v-icon> Probar la regla </v-btn> -->
                        <ItemsDialog :keyword="item.columns.palabra" :pins ="item.columns.pins" :sinonimos="item.columns.sinonimos" :icon="'mdi-flask'"> </ItemsDialog>
                      </v-list-item>

                      <v-list-item color="primary" rounded="shaped" :disabled="!isAdmin()">
                        <NuxtLink :to="'/compras/mantenimientos/busquedas/scriterios/'+item.columns.palabra+'/'" style="margin-right: 15px; padding: 0; border-radius: 41px;" class="link">
                                <v-btn  > <v-icon icon="mdi-file-edit"></v-icon>  Editar regla</v-btn>
                            </NuxtLink>
                      </v-list-item>

                      <v-list-item color="primary" rounded="shaped" :ripple="true" :disabled="!isAdmin()">
                        <v-btn  @click="deleteRegla(item.columns.palabra,theme.global.name.value)"> <v-icon icon="mdi-delete"></v-icon>  Eliminar </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </td>
                <td align="left">
                  <template v-for="div of item.columns.divCodes">
                    {{ div }}
                  </template>
                </td>
                <td align="left">

                  <v-badge color="indigo py-3 text-white text-subtitle-2" :content="item.columns.palabra" inline>
                  </v-badge>
                </td>
                <td align="left">
                  <v-menu v-model="item.columns.detallePin" :close-on-content-click="false" location="start">
                    <template v-slot:activator="{ props }">
                      <v-btn variant="text" v-bind="props">
                        Pins
                        <v-badge color="indigo ml-4 mb-1 text-white text-subtitle-2"
                          :content="item.columns.pins.length"></v-badge>
                      </v-btn>
                    </template>

                    <v-card width="300">
                      <v-list>
                        <v-list-item title="Pines" subtitle="Detalles de los pines">
                          <template v-slot:append> </template>
                        </v-list-item>
                      </v-list>

                      <v-divider class="border-opacity-100 mb-0 mt-0" :thickness="2"></v-divider>

                      <v-list>
                        <v-list-item v-for="pin of item.columns.pins">
                          {{ pin.itemNum }} en la posición <v-badge color="light-blue-lighten-4"
                            :content="pin.fixedIndex + 1" inline />
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>
                <td align="left" >
                  <template v-for="(criterio, index) of item.columns.criterios" class="d-block ">
                    <v-menu v-model="criterio.detalle" :close-on-content-click="false" location="end" >
                      <template v-slot:activator="{ props }">
                        <v-btn class="d-block" variant="text" v-bind="props">{{ index + 1 }} - {{ criterio.nombre.toUpperCase() }}
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item :title="criterio.nombre.toUpperCase()" subtitle="">
                            <template v-slot:append> </template>
                          </v-list-item>
                        </v-list>

                        <v-divider class="border-opacity-100 mb-0 mt-0" :thickness="2"></v-divider>

                        <v-list max-height="200">
                          <v-list-item v-for="(nombre, index) of criterio.datos">
                            {{ index + 1 }} - {{ nombre }}
                            <!-- <v-divider v-if="index < criterio.datos.length - 1" class="border-opacity-100"
                              :thickness="1"></v-divider> -->
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </template>
                </td>
                <td align="left" >
                  <template v-for="(excluido, index) of item.columns.excluidos">
                    <v-menu v-model="excluido.detalle" :close-on-content-click="false" location="end">
                      <template v-slot:activator="{ props }">
                        <v-btn class="d-block" variant="text" v-bind="props">{{ excluido.nombre.toUpperCase() }}
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item :title="excluido.nombre.toUpperCase()" subtitle="">
                            <template v-slot:append> </template>
                          </v-list-item>
                        </v-list>

                        <v-divider class="border-opacity-100 mb-0 mt-0" :thickness="2"></v-divider>

                        <v-list max-height="200">
                          <v-list-item v-for="(nombre, index) of excluido.datos">
                            {{ index + 1 }} - {{ nombre }}
                            <!-- <v-divider v-if="index < excluido.datos.length - 1" class="border-opacity-100"
                              :thickness="1"></v-divider> -->
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </template>
                </td>
                <td align="left" >
                  <template v-for="(sinonimo, index) of item.columns.sinonimos">
                    <p> {{index + 1 }}.- {{ sinonimo }}</p>

                    <!-- <v-menu v-model="excluido.detalle" :close-on-content-click="false" location="end">
                      <template v-slot:activator="{ props }">
                        <v-btn class="d-block" variant="text" v-bind="props">{{ excluido.nombre.toUpperCase() }}
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item :title="excluido.nombre.toUpperCase()" subtitle="">
                            <template v-slot:append> </template>
                          </v-list-item>
                        </v-list>

                        <v-divider class="border-opacity-100 mb-0 mt-0" :thickness="2"></v-divider>

                        <v-list max-height="200">
                          <v-list-item v-for="(nombre, index) of excluido.datos">
                            {{ index + 1 }} - {{ nombre }}

                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu> -->
                  </template>
                </td>
                <td>
                  {{ item.columns.fechaCreacion }}
                </td>
                <td>
                  {{ item.columns.usuarioCreacion }}
                </td>
              </tr>
            </template>
          </v-data-table>
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