
<script>
import axios from 'axios';
import { ArbolService } from "@/app/compras/mantenimientos/busqueda/arbol"
import { ArticulosService } from "@/app/compras/mantenimientos/busqueda/arbol"
import { nodo } from "@/app/compras/mantenimientos/busqueda/arbol"
import loader from '@/commons/vue/loader.vue';
import modal from '@/commons/vue/modal.vue';
import AuthService from '@/auth/service/Auth.js';

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
    name: 'arbol',
    components: {
        nodo,
        loader,
        modal
    },
    props: {
        elemento: Object,
        indice: Number
    },
    data() {
        return {
            elementos: [],
            searchText: '',
            isLoading: false,
            isOpenModal: false,
            datosModal: [],
            dialog: false,
            addLineaDialog: false,
            nombre: ''
        }
    },
    methods: {
        filterTree(nodes) {
            //
            return nodes.filter((node) => {

                if (node.descripcion && node.descripcion.toLowerCase().includes(this.searchText.toLowerCase())) {
                    return true;
                }

                if (node.hijos && node.hijos.length > 0) {
                    const filteredChildren = this.filterTree(node.hijos);
                    if (filteredChildren.length > 0) {
                        node.hijos = filteredChildren;
                        return true;
                    }
                }

                return false;
            });
        },
        async addChild(theme) {
            //agrega una linea
            this.addLineaDialog = false;

            if (!this.nombre) {
                return;
            }

            const data = {
                clave: "",
                descripcion: this.nombre,
                nivel: 0,
                idPadre: 0
            }

            // TODO
            const respuesta = await ArbolService.crearNuevoNodo(data);
            if (respuesta.err !== '') {
                showErrorModal(respuesta.err.response.data.message, theme);
                return;
            }
            showSuccessModal("Linea agregada con exito", theme)
            this.elementos.push(respuesta.data)
            return;

        },
        async refresh() {
            //Inicializa el arbol
            this.isLoading = true;
            const response = await ArbolService.getAllArbol();

            if (response.err !== '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error',
                    text: response.err,
                });
                return;
            }

            this.elementos = response.data;
            this.isLoading = false;
        },
        close() {
            //cierra el modal de los items
            this.isOpenModal = false;
        },
        cerrarDialog(){

            this.addLineaDialog = false
            this.nombre=''
        },
        async openModal() {
            //abre el modal de lo items
            this.datosModal = [];
            this.isOpenModal = true;
            const response = await ArticulosService.getArticulosNot();
            this.datosModal = response.data;
        },

        isAdmin(){
            //Controla el acceso a quien le puede dar clic a los botones
            // de no estar aqui solo se pueden ver los articulos que cotiene cada linea,
            // familia o subfamilia
			let token = localStorage.getItem("jwtToken");
			const tokenParsed = JSON.parse(atob(token.split('.')[1]));
			const puesto = tokenParsed.puesto;
			const numEmpleado= tokenParsed.numEmpleado
			if(puesto=="PROCUREMENT MANAGER" 
            || puesto =="GERENTE" 
            || puesto =="GROUP PRODUCT MANAGER" 
            || numEmpleado =="2220" 
            || numEmpleado == "6879" 
            || numEmpleado == "6879" 
            || numEmpleado=="2071"
            || numEmpleado=="1651"){
				return true;
			}else{
				return false;
			}
		}
    },
    async mounted() {
        this.refresh();
    },
}


</script>

<template>
    <NuxtLayout name="default">

        <template #body>

            <v-card style=" margin: 0 auto;" class="ma-5 rounded-lg" elevation="15">
                <v-card-title class="bg-grey-darken-3 d-flex align-center">
                    <v-icon icon="mdi-tree" size="large"></v-icon>
                    <div class="text-h7 pa-2 content">Árbol</div>
                </v-card-title>
                <div class="pa-5">
<!-- 
                    <v-btn variant="outlined" v-on:click="addChild(theme.global.name.value)" v-if="!isLoading"  color="red">
                                    Agregar linea
                                </v-btn> -->
                    <div class="d-flex justify-space-between mb-3">
                    <v-dialog v-model="addLineaDialog" width="auto" persistent>
                        <template v-slot:activator="{ props }">
                            <div>

                                <!-- <v-btn variant="outlined" class="ma-1" rounded="0"
						:color="elemento?.nivel == 0 ? 'red' : elemento?.nivel == 1 ? 'amber-darken-2' : 'green'"
						v-if="elemento?.nivel < 1" v-bind="props"
						title="Agregar familia"
						>
						<v-icon icon="mdi-sitemap"></v-icon>

					</v-btn> -->
                                <v-btn variant="outlined" v-if="!isLoading" color="red" v-bind="props"
                                    title="Agregar Linea"
                                    :disabled="!isAdmin()">
                                    Agregar linea
                                </v-btn>
                            </div>
                        </template>

                        <v-card>
                            <v-card-text>
                                <div id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout"
                                    aria-hidden="true">
                                    <div role="document">
                                        <div>
                                            <v-row class="d-flex  justify-center mb-5">

                                                <div class="text-center text-h5">Nueva linea </div>
                                            </v-row>
                                            <div class="modal-body" style="min-width: 400px;">
                                                <v-form validate-on="submit lazy"
                                                    @submit.prevent="addChild(theme.global.name.value)">
                                                    <v-text-field label="Nombre de la linea" hide-details="auto"
                                                        v-model="nombre" name="nombre" required></v-text-field>
                                                    <v-btn block variant="outlined" color="blue-darken-1"
                                                        @on-click="addChild(theme.global.name.value)" type="submit"
                                                        class="btn btn-primary btn-block mt-3">Registrar</v-btn>
                                                </v-form>
                                                <v-spacer class="mt-5"></v-spacer>
                                                <v-btn color="red" variant="outlined" block
                                                    @click="cerrarDialog()">Cerrar</v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>

                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialog" width="auto" persistent>
                        <template v-slot:activator="{ props }">
                            <div >
                                <v-btn v-if="!isLoading" variant="outlined" color="blue-darken-1" @click="openModal"
                                    v-bind="props"> Articulos que no estan en el arbol
                                </v-btn>
                            </div>
                        </template>

                        <v-card style="max-height: 600px;">
                            <v-card-text>
                                <div class="modal fade" id="modalLayout" tabindex="-1" role="dialog"
                                    aria-labelledby="modalLayout" aria-hidden="true">
                                    <div class="modal-dialog modal-lg" role="document">
                                        <div class="modal-content">
                                            <v-row class="d-flex  justify-space-between mb-5">

                                                <div class="text-h4 mr-5">Articulos que no estan en el arbol</div>
                                            </v-row>
                                            <div v-if="datosModal.length === 0" style="text-align:center;">
                                                <loader />
                                            </div>

                                            <v-table v-else class="table table-striped table-sm table-bordered table-hover">
                                                <thead class="stylish-color">
                                                    <tr>
                                                        <th>Empleado</th>
                                                        <th>Articulo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="dato in datosModal">
                                                        <td>{{ dato.responsable }}</td>
                                                        <td>{{ dato.itemNum }}</td>
                                                    </tr>
                                                </tbody>
                                            </v-table>
                                            <v-btn color="red" variant="outlined" block
                                                @click="dialog = false">Cerrar</v-btn>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    </div>
                    <loader v-if="isLoading" />

                    <nodo v-else :elementos="elementos" />
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