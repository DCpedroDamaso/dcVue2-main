

<script>
import Swal from 'sweetalert2';
import Popper from "vue3-popper";
import pillsKeyword from '@/app/compras/mantenimientos/busqueda/sinonimos/components/pillsKeyword.vue'
import formulario from '@/app/compras/mantenimientos/busqueda/sinonimos/data/formulario.vue'
import loader from '@/commons/vue/loader.vue'
import busquedaService from '@/app/compras/mantenimientos/busqueda/criterios/services/BusquedaService'
import sinonimosService from '@/app/compras/mantenimientos/busqueda/sinonimos/services/SinonimosService.js';
import AuthService from '@/auth/service/Auth.js';


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
    name: 'sinonimos',
    beforeRouteEnter(to, from) {
        if (AuthService.isAdmin())
            return true;
        else
            return false;
    },
    methods: {
        handleClickPill(value) {
            this.palabraSelect = value;
            this.getSinonimos();
        },
        async handleRefresh() {
            this.getKeywords();
        },
        async getKeywords() {
            this.isLoading = true;
            const response = await sinonimosService.getKeywords();
            if (response.err === '') {
                this.datos = response.data;
            }
            this.datos.forEach(async({palabra}) => {
                const res=await busquedaService.existeRegla(palabra)
                this.datosExisteRegla.push({"keyword":palabra, "existe":res.data})
            });
            this.isLoading = false;
        },
        filterKeywords() {
            //this.datosMostrar = datos.filter(p => p.palabra.includes(this.palabraSearch) )
        },
        async getSinonimos() {
            if (this.palabraSelect === '') return;
            const res = await sinonimosService.getSynonyms(this.palabraSelect);
            if (res.err !== '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops!',
                    text: res.err,
                });
                this.sinonimos = [];
            }

            this.sinonimos = res.data;
        },
        async deleteSinonimo(sinonimo,keyword,theme) {
            const res = await sinonimosService.deleteSynonyms(sinonimo,keyword);
            if (res.err == '') {
                showSuccessModal("Eliminado con exito",theme)
            } else {
                showErrorModal("Error al eliminar",theme)
            }
            this.getSinonimos();
        },
        deleteAsk(sinonimo,keyword,theme) {
            Swal.fire({
                color: theme == "dark" ? '#F5F5F5' : '#212121',
		        background: theme != "dark" ? "#F5F5F5" : "#212121",        
                title: `Estas seguro de borrar el sinonimo ${sinonimo}`,
                text: "Si existe una regla, sera eliminada",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteSinonimo(sinonimo,keyword,theme);
                }
            })
        },
        async prueba(theme) { 
            const { value: nombre } = await Swal.fire({
                inputLabel: 'Ingresa el nombre de la linea',
                input: 'text',
                title: 'NUEVA LINEA',
                color: theme=="dark" ? '#F5F5F5' :'#212121',
                background: theme!="dark" ? "#F5F5F5" :"#212121",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Inserta un nombre para la linea'
                    }
                }
            });
        },
        closeDialog(){
            this.dialog = false;
        },
        async agregarSinonimo(sinonimo,keyword,theme ){

            if(sinonimo.trim()==""){
                return;
            }
            this.addSinonimoDialog=false;
            const segundaValidacion = await Swal.fire({
                title: 'Estas seguro de quieres agregar un nuevo sinonimo?',
				text: "Si existe una regla, sera eliminada",
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
            const res = await sinonimosService.addSinonimo(sinonimo,keyword);

            if (res.err !== '') {
                showErrorModal("Error al guardar el sinonimo",theme)
                return;
            }
            showSuccessModal("Sinonimo cargado con exito",theme)
            this.sinonimos.push(sinonimo)
        },
        existeRegla(keyword){
            let existe = false
            this.datosExisteRegla.forEach(el=>{
                if(el["keyword"]==keyword && el["existe"]){
                    existe=true;
                }
            })
            return existe;

        }
        
    },
    data() {
        return {
            datos: [],
            datosExisteRegla:[],
            sinonimos: [],
            palabraSelect: '',
            palabraSearch: '',
            isLoading: false,
            dialog: false,
            addSinonimoDialog:false,
            nuevoSinonimo:'',
            radio:'',
        }
    },
    components: {
        pillsKeyword,
        formulario,
        loader,
        Popper
    },
    computed: {
        filteredData() {
            if (this.datos.length === 0) return [];
            return this.datos.filter(p => p.palabra.includes(this.palabraSearch.toUpperCase()))
        }
    },
    async mounted() {
        this.getKeywords();
    },
}
</script>



<template>
    <NuxtLayout name="default">
        <template #body>


            <v-card class="sombra ma-5" elevation="15">

                <v-card-title class="bg-grey-darken-3 d-flex  align-center">
                    <v-icon icon="mdi-content-copy" size="large"></v-icon>
                    <div class="text-h7 pa-2 content">Sinonimos</div>
                </v-card-title>
                <div class="pa-5">
                    <loader v-if="isLoading" />
                    <v-sheet v-else :elevation="5" class="rounded" pa-5>
                        <v-toolbar >
                            <!-- <form @submit.prevent class="form-inline ml-auto"> -->
                            <div style="width: 380px; margin-top: 10px;" class="mt-1">
                            <v-text-field v-on:keydown.enter.prevent="filterKeywords" v-model="palabraSearch"
                                class="form-control ma-2 mt-5" style="width: 380px;" type="text" placeholder="Buscar" aria-label="Buscar"></v-text-field>
                            </div>
                    <!-- </form>  -->
                        </v-toolbar>
                        
                    <div v-if="filteredData.length === 0">
                        <h3>No hay sinonimos cargados</h3>
                    </div>
                    <!-- <div v-else class="tab-content"> -->

                    <!-- Panel 1 -->
                    <!-- <div class="tab-pane show active"> -->
                    <!-- <v-tab> -->
                    <!-- Nav tabs -->

                    <v-row class="mt-4">
                        <!-- <v-col cols="4" style="height: 300px; overflow-y: scroll;"> -->
                        <v-col cols="3" style="height: 300px; overflow-y: scroll;">
                            <v-radio-group  class="mb-2 text-h7 " v-model="radio">

                                    <!-- <pillsKeyword v-for="dato in filteredData" :palabra="dato.palabra" :palabraSelect="palabraSelect"
                                    @on-click="handleClickPill" style="cursor: pointer"/> -->
                                    <v-radio v-for="dato in filteredData" :value="dato.palabra" @click="handleClickPill(dato.palabra)" class="" color="yellow-darken-1">
                                    <template v-slot:label>
                                        <div class="text-h7" > {{ dato.palabra }} 
                                            <Popper v-if="!existeRegla(dato.palabra)"  class="pop"
                                                arrow hover placement="right"
                                                content="No hay regla cargada">
                                                <v-icon  color="red" icon="mdi-alert-outline"></v-icon>
                                            </Popper>
                                            <Popper v-else  class="pop"
                                                arrow hover placement="right"
                                                content="Tiene regla">
                                                <v-icon  icon="mdi-check" color="green"></v-icon>
                                            </Popper>
                                            <!-- <v-icon v-if="!existeRegla(dato.palabra)" color="red" icon="mdi-alert-outline"></v-icon>
                                             <v-icon v-else icon="mdi-check" color="green"></v-icon> -->
                                             
                                            </div>
                                    </template>
                                    </v-radio>
                                <!-- <v-item v-slot="{ isSelected, toggle }">
                                    <v-card
                                    :color="isSelected ? 'primary' : ''"
                                    class="d-flex align-center"
                                    dark
                                    height="200"
                                    @click="toggle"
                                    >
                                    <v-scroll-y-transition>
                                        <div
                                        class="text-h3 flex-grow-1 text-center"
                                        >
                                        {{ isSelected ? 'Selected' : 'Click Me!' }}
                                        </div>
                                    </v-scroll-y-transition>
                                    </v-card>
                                </v-item> -->


                            </v-radio-group>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col  cols="8" class="d-flex justify-center align-center" >
                            <v-card variant="tonal" width="600" v-if="palabraSelect != ''">
                                <v-toolbar class="d-flex justify-space-between">
                                    
                                    <v-card-title class="text-h7">Sinonimos de: <v-chip class='bg-yellow-darken-1 pa-1 rounded text-black text-h7'>{{ palabraSelect }} </v-chip>  </v-card-title>                            
                                    <div class="text-center">
                                    <v-btn
                                    color="green"  variant="outlined" position="right"
                                    @click="addSinonimoDialog = true"
                                    >
                                    Crear
                                    </v-btn>

                                    <v-dialog
                                    v-model="addSinonimoDialog"
                                    width="450"
                                    >
                                        <v-card>
                                            <v-card-text>
                                            <v-form validate-on="submit lazy" class="mb-4"
                                                @submit.prevent="agregarSinonimo(nuevoSinonimo,palabraSelect, theme.global.name.value)">
                                                <v-text-field label="Sinonimo" hide-details="auto" v-model="nuevoSinonimo"
                                                    name="nombre" required></v-text-field>
                                                <v-btn block variant="outlined" color="blue-darken-1"
                                                    @on-click="agregarSinonimo(nuevoSinonimo,palabraSelect, theme.global.name.value)" type="submit"
                                                    class="btn btn-primary btn-block mt-3">Registrar</v-btn>
                                            </v-form>
                                            <v-btn color="red" variant="outlined" block
											@click="addSinonimoDialog = false" >Cerrar</v-btn>
                                        </v-card-text>
										<v-spacer class="mt-5"></v-spacer>
										

                                        </v-card>
                                    </v-dialog>
                                </div>
                                </v-toolbar>
                                <v-card-item>
                                        <v-card-text class="mt-4">
                                        <template v-for="sinonimo in sinonimos" >
                                                <v-chip style="font-size: 13px; margin-right: 20px;">{{ sinonimo }} <v-icon color="red"
                                                    icon="mdi-close" v-on:click="deleteAsk(sinonimo,palabraSelect, theme.global.name.value)"></v-icon></v-chip>
                                        </template>
                                    </v-card-text>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-sheet>
                    <!-- <ul class="btn-list">
          <li><a class="btn-floating btn-md blue"><v-icon icon="mdi-magnify" color="red"></v-icon></a></li>
          <li><a class="btn-floating btn-md green" data-toggle="modal" data-target="#modalLayout"><v-icon icon="mdi-upload"></v-icon></a></li>
        </ul> -->

                    <!-- <div class="modal fade" id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout"
        aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title w-100" id="">Cargar nuevo sinonimo</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <formulario @refresh="handleRefresh()"/>
                </div>
            </div>
        </div>
    </div> -->
                    <v-dialog v-model="dialog" width="auto" persistent>
                        <template v-slot:activator="{ props }">
                            <div style="position:fixed;bottom: 45px; right: 24px;">

                                <v-btn color="blue" v-bind="props"  variant="outlined" class="btn-floating btn-md blue" icon="mdi-upload">
                                </v-btn>
                            </div>
                        </template>

                        <v-card>
                            <v-card-text>
                                <div class="modal fade" id="modalLayout" tabindex="-1" role="dialog"
                                    aria-labelledby="modalLayout" aria-hidden="true">
                                    <div class="modal-dialog modal-lg" role="document">
                                        <div class="modal-content">
                                            <v-row class="d-flex  justify-space-between mb-5">

                                                <h4>Cargar nuevo sinonimo</h4>
                                            </v-row>
                                            <div class="modal-body" style="min-width: 400px;">
                                                <formulario @refresh="getSinonimos()" @closeDialog="closeDialog()"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="red" block @click="dialog = false" variant="outlined">Cerrar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>


            </v-card>
        </template>
    </NuxtLayout>
</template>


<style>
.red{
color: red;
}
</style>



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