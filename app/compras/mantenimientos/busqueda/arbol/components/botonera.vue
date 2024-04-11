<script>
import { createApp } from "vue/dist/vue.esm-bundler";
import Swal from 'sweetalert2';
import { store, ArbolService, ArticulosService, tabla, boton } from "@/app/compras/mantenimientos/busqueda/arbol"
import loader from '@/commons/vue/loader.vue';

async function mostrarModal(elemento, theme) {

	Swal.fire({
		color: theme == "dark" ? '#F5F5F5' : '#212121',
		background: theme != "dark" ? "#F5F5F5" : "#212121",
		title: 'Articulos de ' + elemento.descripcion,
		html: `<style>.swal-wide{width:950px !important;  margin: 10px, 10px, 40px, 10px !important; padding: 20px, 10px, } </style>

				  	<br>
					<div id="tabla-container"></div>`,
		customClass: 'swal-wide',
		didOpen: async function () {

			Swal.showLoading()
			const [err, articulos] = await ArticulosService.getItems(elemento);
			Swal.hideLoading()

			if (err) {
				let mensaje = '';
				if (err.response) {
					mensaje = err.response.data.message;
				} else if (err.request) {
					mensaje = err.request;
				} else {
					mensaje = err.message;
				}


				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: mensaje,
				});
				return;
			}

			createApp({
				data() {
					return { articulos }
				},
				components: {
					tabla
				},
				template: `
					<tabla :articulos="articulos" />
				`,
			}).mount('#tabla-container');

		}
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

function showErrorModal(mensaje, theme) {
	Swal.fire({
		color: theme == "dark" ? '#F5F5F5' : '#212121',
		background: theme != "dark" ? "#F5F5F5" : "#212121",
		icon: 'error',
		title: 'Oops...',
		text: mensaje,
	});
}

export default {
	name: 'botonera',
	data() {
		return {
			store,
			addNodoDialog: false,
			addNodoSubfamilia: false,
			addArticuloDialog: false,
			showArticulosDialog: false,
			editAtributosDialog: false,
			nombre: '',
			layout: '',
			layoutTexto:'',
			atributos: '',
			selected: [],
			atributosFiltrados: [],
			atributosBySubfamilia: [],
			descripciones: '',
			isLoadingDescripciones:true,
			selectedValues: {},
			existeArticulo: 'w',
			espesificaiones:{},
			isNewDescripcion:false,
		}
	},
	components: {
		boton,
		loader
	},
	props: {
		elemento: Object,
		indice: Number
	},
	emits: ["increment-articulos", 'delete-nodo'],

	methods: {
		async addChild(elemento, theme) {
			//agrega un hijo a familia
			if (elemento.nivel + 1 > store.nivelLimite) {
				showErrorModal('No se pueden crear mas de 3 subfamilias!', theme);
				this.nombre=''
				return;
			}

			const titulo = this.getNextNivel(elemento).toUpperCase();
			if (!this.nombre) {
				return;
			}

			const data = {
				clave: "",
				descripcion: this.nombre,
				nivel: elemento.nivel + 1,
				idPadre: elemento.id
			}
			this.addNodoDialog = false;
			const respuesta = await ArbolService.crearNuevoNodo(data);
			if (respuesta.err !== '') {
				showErrorModal(respuesta.err.response.data.message, theme);
				this.nombre=''
				return;
			}
			elemento.hijos.push(respuesta.data)
			showSuccessModal("Nodo creado con exito", theme)
			this.nombre=''
		},

		async addChildSubfamilia(elemento, theme) {
			//agrega un hijo a subfamilia
			if (elemento.nivel + 1 > store.nivelLimite) {
				showErrorModal('No se pueden crear mas de 3 subfamilias!', theme);
				this.nombre=''
				return;
			}
			if (this.selected.length == 0) {
				this.addNodoSubfamilia = false;
				showErrorModal('Debe seleccionar por lo menos un Atributo', theme);
				this.nombre=''
				return;
			}
			const titulo = this.getNextNivel(elemento).toUpperCase();
			// if (this.nombre.trim.length==0) {
			// 	this.addNodoSubfamilia=false;
			// 	showErrorModal('Debe Agregar un nombre',theme);
			// 	return;
			// }

			const nodo = {
				clave: "",
				descripcion: this.nombre,
				nivel: elemento.nivel + 1,
				idPadre: elemento.id
			}
			
			const atributosArray = []

			for (const item of this.selected) {
				atributosArray.push(item)
			}


			this.addNodoSubfamilia = false;
			const respuesta = await ArbolService.crearNuevoNodo(nodo, atributosArray);
			if (respuesta.err !== '') {
				showErrorModal(respuesta.err.response.data.message, theme);
				this.nombre=''
				return;
			}

			elemento.hijos.push(respuesta.data)
			showSuccessModal("Nodo creado con exito", theme)
			this.nombre=''

		},
		async getAtributos() {
			//trae los atributos 
			const [err, atributos] = await ArticulosService.getAtributos();
			this.atributosFiltrados = atributos
			this.atributos = atributos
		},
		async getDescripciones(elemento) {
			//tra  la descripcion del elemento
			const [errAtr, descripciones] = await ArticulosService.getDescripciones(elemento.id);
			console.log(descripciones)
			this.descripciones = descripciones
			this.isLoadingDescripciones=false;
		},

		async getAtributosBySubfamilia(elemento) {
			//trae los atributos de la subfamilia
			const [err, atributos] = await ArticulosService.getAtributosBySubfamilia(elemento.id);
			this.atributosBySubfamilia = atributos
			for (let i = 0; i < this.atributosBySubfamilia.length; i++) {
				const atributo = this.atributosBySubfamilia[i];
				if (atributo[2] == "1" || atributo[2] == 1) {
					this.selected.push(atributo)
				}
			}
		},
		async updateAtributosBySubfamilia(elemento, theme) {
			//actualiza los atributos que puede tener una subfamilia
			this.editAtributosDialog = false;
			const validacion = await Swal.fire({
				title: 'Estas seguro de querer guardar los cambios?',
				text: "Esta por guardarlos cambios",
				icon: 'warning',
				color: theme == "dark" ? '#F5F5F5' : '#212121',
				background: theme != "dark" ? "#F5F5F5" : "#212121",
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, guardar!'
			});
			if (validacion.isDismissed) {
				return;
			}
			this.editAtributosDialog = true;
			const [err, atributos] = await ArticulosService.updateAtributosBySubfamilia(elemento.id, this.selected)

		},

		async removeNode(elemento, indice, theme) {
			//Remueve un elemento del arbol
			const segundaValidacion = await Swal.fire({
				title: 'Estas seguro de querer eliminar?',
				text: "Esta por eliminar!",
				icon: 'warning',
				color: theme == "dark" ? '#F5F5F5' : '#212121',
				background: theme != "dark" ? "#F5F5F5" : "#212121",
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminalo!'
			});

			if (segundaValidacion.isDismissed) {
				return;
			}


			let error = ''
			// error = (elemento.nivel < 1) ? 'No se puede eliminar una linea' : error;
			error = (elemento.hijos?.length > 0) ? 'No se puede eliminar un nodo con hijos' : error;
			error = (elemento.articulos?.length > 0) ? 'No se puede eliminar un nodo que tenga articulos asignados' : error;

			if (error !== '') {
				Swal.fire({
					color: theme == "dark" ? '#F5F5F5' : '#212121',
					background: theme != "dark" ? "#F5F5F5" : "#212121",
					icon: 'error',
					title: 'Oops...',
					text: error,
				});
				return;
			}


			const nodo = {
				nivel: elemento.nivel,
				id: elemento.id
			}
			const respuesta = await ArbolService.deleteNodo(nodo);

			if (respuesta.err !== '') {
				showErrorModal(respuesta.err, theme);
				return;
			}

			this.$emit('delete-nodo', indice);

			Swal.fire({

				icon: 'success',
				title: 'Elemento eliminado con exito.',
				text: 'Exito',
				color: theme == "dark" ? '#F5F5F5' : '#212121',
				background: theme != "dark" ? "#F5F5F5" : "#212121",
			});
			//console.log(respuesta.data)
			//elemento.hijos.push(respuesta.data)

		},
		async validarArticulo(elemento,theme){
			//verifica que el item exista en el arbol para poder pasarlo a otra subfamilia
			const text = this.layout;
			if (!text) return;
			this.layoutTexto = text;
			const articulos = text.split("\n");
			const [errE, existe] = await ArticulosService.existeArticulo(articulos)
			this.existeArticulo = existe;
			if(this.existeArticulo){
				const [errE, resEspecificaciones] = await ArticulosService.getEspecificaciones(articulos);
				this.espesificaiones = resEspecificaciones;
			}
		},
		async cargarArticulo(elemento, theme) {
			//carga un articulo en una subfamilia
			const text = this.layout;
			if (!text) return;
			const articulos = text.split("\n");
			this.addArticuloDialog = false;
			if(!this.existeArticulo){
				showErrorModal('El articulo no existe', theme);
				return;
			}
			if (elemento.nivel < 2) {
				showErrorModal('No se pueden ligar articulos sin una subfamilia', theme);
				return;
			}

			if (articulos.length > 1) {
				showErrorModal('No se pueden ligar mas de un articulo a la vez', theme);
				return;
			}
			if(Object.keys(this.selectedValues).length < Object.keys(this.descripciones).length){
				showErrorModal('Debe seleccionar todos las descripciones', theme);
				return;
			}

			for (const valor of Object.values(this.selectedValues)) {
				console.log(valor);
				if(valor.trim().length<1){
					showErrorModal('No puedes dejar ningun campo vacio', theme);
					return;
				}
				}
			console.log(this.selectedValues)
			const [err, items] = await ArticulosService.saveItems(articulos, elemento.id, this.selectedValues)
			this.layout=''
			this.espesificaiones=''
			this.existeArticulo='w'
			this.addArticuloDialog=false
			this.selectedValues={};
			
			if (err) {
				let mensaje = '';
				if (err.response) {
					mensaje = err.response.data.message;
				} else if (err.request) {
					mensaje = err.request;
				} else {
					mensaje = err.message;
				}
				showErrorModal(mensaje, theme);
				return;
			}


			if (!elemento.articulos) elemento.articulos = [];

			elemento.articulos.push(items);
			elemento.noArticulos += items.length;
			this.$emit('increment-articulos', parseInt(items.length));
			this.addArticuloDialog = false;
			showSuccessModal('Los articulos se han ligado con exito', theme);
		},
		showArticulos(elemento, theme) {
			//muestra los articulos que puede contener, la linea, familia o subfamilia
			mostrarModal(elemento, theme);

		},
		getNextNivel(elemento) {
			switch (elemento.nivel) {
				case 0:
					return 'Agregar familia'
				case 1:
					return 'Agregar subfamilia 1'
				case 2:
					return 'Agregar subfamilia 2'
				case 3:
					return 'Agregar subfamilia 3'
				default:
					return ''
			}
		},
		getProps(elemento) {
			addChild(elemento, "")
		},
		filtrarDatos() {
			if (this.palabraSearch.length == 0) {
				this.atributosFiltrados = this.atributos
			} else {

				this.atributosFiltrados = this.atributos.filter((atributo) => atributo[1].toLowerCase().includes(this.palabraSearch.toLowerCase()));
			}
		},
		cerrarDialog(){
			this.layout=''
			this.espesificaiones=''
			this.existeArticulo='w'
			this.addArticuloDialog=false
			this.selectedValues={}
			this.name=''
			this.nombre=''
			this.palabraSearch=''
			this.selected=[]
			this.editAtributosDialog = false
			this.addNodoDialog = false
			this.addNodoSubfamilia = false
		},
		limpiarCatalogo(){
			this.selectedValues={};
		},
		isAdmin(){
			let token = localStorage.getItem("jwtToken");
			const tokenParsed = JSON.parse(atob(token.split('.')[1]));
			const puesto = tokenParsed.puesto;
			const numEmpleado= tokenParsed.numEmpleado
			if( numEmpleado =="2220" 
			|| numEmpleado == "6879" 
			|| numEmpleado == "3647" 
			||numEmpleado=="2071"
			||numEmpleado=="1651" ){
				return true;
			}else{
				return false;
			}
		},
		isAdmin2(){
			let token = localStorage.getItem("jwtToken");
			const tokenParsed = JSON.parse(atob(token.split('.')[1]));
			const puesto = tokenParsed.puesto;
			const numEmpleado= tokenParsed.numEmpleado
			if( puesto=="PROCUREMENT MANAGER" ||  puesto=="GERENTE" 
                || puesto=="GROUP PRODUCT MANAGER" 
				|| numEmpleado =="2220" 
				|| numEmpleado == "6879" 
				|| numEmpleado == "3647" 
				||numEmpleado=="2071"
				||numEmpleado=="1651"){
				return true;
			}else{
				return false;
			}
		}
	}
}

</script>


<template>	
	<div class="d-flex justify-center align-center">


		<!-- ADDD subfamilia-->
		<v-lazy transition="fade-transition">


			<v-dialog v-model="addNodoSubfamilia" width="auto" persistent>
				<template v-slot:activator="{ props }">
					<div>

						<v-btn variant="outlined" class="ma-1" rounded="0"
							:color="elemento?.nivel == 0 ? 'red' : elemento?.nivel == 1 ? 'amber-darken-2' : 'green'"
							v-if="elemento?.nivel == 1" @click="getAtributos" v-bind="props" title="Agregar subfamilia"
							:disabled="!isAdmin()"
							>
							<v-icon icon="mdi-sitemap"></v-icon>
						</v-btn>
					</div>
				</template>

				<v-card>
					<v-card-text>
						<div id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout" aria-hidden="true">
							<div role="document">
								<div>
									<v-row class="d-flex  justify-center mb-5">

										<div class="text-h5 text-center">Nueva Subfamilia para {{ elemento.descripcion }}
										</div>
										<!-- <button type="button" @click="addNodoSubfamilia = false" class="close"
										data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button> -->
									</v-row>
									<div class="modal-body" style="min-width: 400px;">
										<v-form validate-on="submit lazy"
											@submit.prevent="addChildSubfamilia(elemento, theme.global.name.value)">
											<v-text-field label="Nombre de la Subfamilia" hide-details="auto"
												v-model="nombre" name="nombre" required class="mb-2"></v-text-field>
											<p>Atributos:</p>
											<div v-for="select in selected" class="d-inline bg-blue pa-1 rounded-pill mt-1">
												{{ select[1] }}
											</div>

											<v-text-field @input="filtrarDatos" v-model="palabraSearch" type="text"
												placeholder="Buscar..."></v-text-field>
											<v-btn block variant="outlined" color="blue-darken-1"
												@on-click="addChildSubfamilia(elemento, theme.global.name.value)"
												type="submit" class="btn btn-primary btn-block mt-1 mb-3">Registrar</v-btn>
											<v-btn color="red" class="mb-4" block variant="outlined"
											@click="cerrarDialog()">Cerrar</v-btn>
											<v-row class="d-flex flex-column">
												<!-- <v-col cols = "6" v-for="atributo in atributos"> -->
												<v-switch v-for="atributo in atributosFiltrados" v-model="selected"
													:label="`${atributo[0]}: ${atributo[1]}`" :value="atributo" hide-details inset>
												</v-switch>
												<!-- </v-col> -->
											</v-row>

										</v-form>
										<v-spacer class="mt-5"></v-spacer>

									</div>
								</div>
							</div>
						</div>
					</v-card-text>
					<v-card-actions>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-lazy>
		<!-------------------- LAYOUT ------------------------->




		<v-lazy transition="fade-transition">
			<v-dialog v-model="addNodoDialog" width="auto" persistent>
				<template v-slot:activator="{ props }">
					<div>

						<v-btn variant="outlined" class="ma-1" rounded="0"
							:color="elemento?.nivel == 0 ? 'red' : elemento?.nivel == 1 ? 'amber-darken-2' : 'green'"
							v-if="elemento?.nivel < 1" v-bind="props" title="Agregar familia"
							:disabled="!isAdmin()">
							<v-icon icon="mdi-sitemap"></v-icon>
						</v-btn>
					</div>
				</template>

				<v-card>
					<v-card-text>
						<div id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout" aria-hidden="true">
							<div role="document">
								<div>
									<v-row class="d-flex  justify-center mb-5">

										<div class="text-center text-h5">Nueva familia para {{ elemento.descripcion }}</div>
										<!-- <button type="button" @click="addNodoDialog = false" class="close" data-dismiss="modal"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button> -->
									</v-row>
									<div class="modal-body" style="min-width: 400px;">
										<v-form validate-on="submit lazy"
											@submit.prevent="addChild(elemento, theme.global.name.value)">
											<v-text-field label="Nombre de la familia" hide-details="auto" v-model="nombre"
												name="nombre" required></v-text-field>
											<v-btn block variant="outlined" color="blue-darken-1"
												@on-click="addChild(elemento, theme.global.name.value)" type="submit"
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
		</v-lazy>
		<v-lazy transition="fade-transition">
			<boton @on-click="showArticulos(elemento, theme.global.name.value)" :titleTooltip="'Ver articulos'"
				:nivel="elemento?.nivel">
				<v-icon icon="mdi-magnify"></v-icon>
			</boton>
		</v-lazy>
		<v-lazy transition="fade-transition">
			<boton v-if="elemento.nivel >= 0" @on-click="removeNode(elemento, indice, theme.global.name.value)"
				:titleTooltip="'Eliminar nodo'" 
				:nivel="elemento?.nivel"
				:isDisabled="!isAdmin()">
				<v-icon icon="mdi-close"></v-icon>
			</boton>
		</v-lazy>
		<v-lazy transition="fade-transition">
			<v-dialog v-model="addArticuloDialog" width="auto" persistent>
				<template v-slot:activator="{ props }">
					<div>

						<v-btn variant="outlined" class="ma-1" rounded="0"
							:color="elemento?.nivel == 0 ? 'red' : elemento?.nivel == 1 ? 'amber-darken-2' : 'green'"
							v-if="elemento?.nivel > 1" v-bind="props" @click="getDescripciones(elemento)"
							title="Agregar articulo"
							:disabled="!isAdmin2()">
							<v-icon icon="mdi-link-variant"></v-icon>
						</v-btn>
					</div>
				</template>

				<v-card >
					<v-card-text>
						<div id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout" aria-hidden="true">
							<div role="document">
								<div>
									<v-row class="d-flex flex-column justify-center mb-5">

										<div class="text-h5 text-center">Carga Articulo para {{ elemento.descripcion }}
										</div>  
										
											<v-radio-group
												v-model="isNewDescripcion"
												inline
												class="d-flex justify-center align-center"
												v-if="existeArticulo==true">
												<p class="text-h7 d-flex justify-center align-center">Existe: </p>
												<v-radio :value=false @click="limpiarCatalogo()"></v-radio>
												<p class="text-h7 d-flex justify-center align-center">Nuevo: </p>
												<v-radio :value=true></v-radio>
											</v-radio-group>
									</v-row>
									<div class="modal-body" style="min-width: 400px;">
										<v-form validate-on="submit lazy" min-width="1000"
											@submit.prevent="cargarArticulo(elemento, theme.global.name.value)">
											<v-text-field v-if="existeArticulo==false || existeArticulo=='w' " label="Articulo" hide-details="auto" v-model="layout"
												name="layout" required></v-text-field>

												
												<div v-if="existeArticulo==true" class="mt-3">
													<div style="display: flex;   align-items: center; justify-content: right;">
													<!-- <div class="text-h5" style="max-width: 250px; margin: 0 auto; text-align: center;" >{{ layout }}</div> -->
													<div class="text-h5" style="max-width: 250px;   width: 100%;  text-align: center;  margin-right: 100px;  margin-bottom: 10px;" >{{ layout }}</div>
													<div style="padding: 10px;  margin-right: 0;" >
														<v-btn  variant="outlined"
															color="blue-darken-1" @on-click="cargarArticulo(elemento, theme.global.name.value)" type="submit"
															class="btn btn-primary btn-block">Registrar</v-btn>
													</div>
													<div style=" padding: 10px; margin-right: 0;">
														<v-btn color="red" variant="outlined"
															@click="cerrarDialog()" >Cerrar</v-btn>
													</div>
												</div>
												<v-row justify="space-around"   mt-1>
													<v-col cols="6" style="min-width: 500px;">
														<v-card variant="outlined" class="pl-3 pb-3 pr-3"   max-width="600">
															<div class="text-h6 mb-3">
																Especificaciones
															</div>
															<div :class="theme.global.name.value =='dark'? 'listaD' :'listaL'">
															<v-row v-for="(value, key) in espesificaiones" :key="key" >
																<v-col style="padding-top: 0;">
																	<div class="text-h7" style="font-weight: 900;"> {{ key }}</div>
																</v-col>
																<v-col style="padding-top: 0;">
																	<div class="text-h7"> {{ value }}</div>
																</v-col>
															</v-row>
														</div>
														</v-card>
													</v-col>
													<v-col cols="5">
														<v-card variant="outlined" class="pl-3 pb-3 pr-3" width="360">

														<div class="text-h6 mb-3">
															Datos
														</div>
														<div v-if="isLoadingDescripciones" style="text-align:center;">
															<loader />
														</div>
														<div v-if="isNewDescripcion">
															<v-text-field   
															v-for="(values, key) in descripciones" :key="key"
															:label="`${key}`" hide-details="auto" v-model="selectedValues[`${key}/N`]"
															name="layout" required
															:disabled="values.find((value)=>value==selectedValues[key])">
														</v-text-field>

														</div>
														<div v-else>
															<v-select v-for="(values, key) in descripciones" :key="key" 
															:label="`${key}`" :items="values" v-model="selectedValues[key]"
															density="compact"
															hide-details="false"
															class="mt-2"
															variant="outlined"
															>
															</v-select>
														</div>
													</v-card>
												</v-col>
												<v-container style="max-width: 600px; padding: 10px 0;">
												<!-- <v-btn block variant="outlined" color="blue-darken-1" 													@on-click="cargarArticulo(elemento, theme.global.name.value)" type="submit"
													class="btn btn-primary btn-block mt-3">Registrar</v-btn> -->
												</v-container>
											</v-row>
										</div>
										
										</v-form>
										<div v-if="existeArticulo == false || existeArticulo == 'w'">

										<div class="text-h5 " v-if="existeArticulo==false">
											<v-spacer class="mt-5"></v-spacer>
											El Articulo <div class="text-red d-inline"> {{ layoutTexto }}</div> no existe
										</div>
										<v-btn block variant="outlined" color="blue-darken-1"
											@click="validarArticulo(elemento, theme.global.name.value)"
											class="btn btn-primary btn-block mt-3"
											v-if="existeArticulo == false || existeArticulo == 'w'" 
											>Validar articulo</v-btn>
										</div>
										<v-spacer class="mt-5"></v-spacer>
										<v-container style="padding: 0; max-width: 600px;" v-if="existeArticulo == false || existeArticulo == 'w'" >
										<v-btn color="red" variant="outlined" block @click="cerrarDialog()"  >Cerrar </v-btn>
										</v-container>
									</div>
								</div>
							</div>
						</div>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-lazy>
		<!--------------- Editar Atributos ------------------------>
		<v-lazy transition="fade-transition">
			<v-dialog v-model="editAtributosDialog" width="auto" persistent>
				<template v-slot:activator="{ props }">
					<div>

						<v-btn @click="getAtributosBySubfamilia(elemento)" variant="outlined" class="ma-1" rounded="0"
							:color="elemento?.nivel == 0 ? 'red' : elemento?.nivel == 1 ? 'amber-darken-2' : 'green'"
							v-if="elemento?.nivel > 1" v-bind="props" title="Atributos">
							<v-icon icon="mdi-egg"></v-icon>
						</v-btn>
					</div>
				</template>

				<v-card>
					<v-card-text>
						<div id="modalLayout" tabindex="-1" role="dialog" aria-labelledby="modalLayout" aria-hidden="true">
							<div role="document">
								<div>
									<!-- <v-form validate-on="submit lazy"
									@submit.prevent="updateAtributosBySubfamilia(elemento,theme.global.name.value)">
									<v-row class="d-flex flex-column">

										<div class="text-h3"> Atributos </div>
										<v-switch v-for="atributo in atributosBySubfamilia" v-model="selected"
											:label="`${atributo[0]}`" :value="atributo" hide-details inset>
										</v-switch>
									</v-row>
									<v-btn color="blue-darken-1"
										@on-click="updateAtributosBySubfamilia(elemento,theme.global.name.value)" type="submit"
										class="btn btn-primary btn-block mt-3">Guardar Cambios</v-btn>
									<div class="modal-body" style="min-width: 400px;">
									</div>
								</v-form> -->
									<div class="text-h5 text-center ma-1"> Atributos: {{ elemento.descripcion }} </div>
									<div v-for="atributo in atributosBySubfamilia">
										<v-switch disabled v-model="selected" :label="`${atributo[0]}`" :value="atributo"
											inset>

										</v-switch>
									</div>
									<v-btn color="red" variant="outlined" block
										@click="cerrarDialog()">Cerrar</v-btn>
								</div>
							</div>
						</div>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-lazy>
	</div>
</template>

<style>
.listaL > div:nth-child(even) {
  background-color: #ffffff; /* Color para elementos pares */
}

.listaL > div:nth-child(odd) {
  background-color: #ccc; /* Color para elementos impares */
}

.listaD > div:nth-child(even) {
  background-color: #454545; /* Color para elementos pares */
}

.listaD > div:nth-child(odd) {
  background-color: #ffffff00; /* Color para elementos impares */
}


</style>
<script setup>
	import { useTheme } from "vuetify";
	const theme = useTheme();

</script>

<div id="app">
	{{ info }}
  </div>