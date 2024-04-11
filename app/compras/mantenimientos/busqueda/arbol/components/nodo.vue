<script>
// import {store} from '../../services/arbol/store';
import {store} from "@/app/compras/mantenimientos/busqueda/arbol"

import {botonera} from "@/app/compras/mantenimientos/busqueda/arbol"


export default{
    name: 'nodo',
	components: {
		botonera
	},
	emits: ["increment-articulos"],
	data() {
		return {
			store, 	
			textClass : 'text-danger',
		}
	},
	props: {
		elementos: Array,
	},
    mounted() {
		if (this.elementos.length > 0 && this.elementos[0] && this.elementos[0].nivel > store.nivelMax) {
			store.setNuevoNivel(this.elementos[0].nivel);
		}	
		this.textClass = this.getClassText(this.elementos[0]);
	},
	methods:{
		getClassText(elemento){
			return 'text-' + this.getColor(elemento?.nivel)
		},
		getColor(nivel){
			switch(nivel){
				case 1:
					return 'warning'
				case 2:
					return 'success'
				case 3:
					return 'primary'
				case 4: 
					return 'blue-grey'
				default:
					return 'red'
				}
		},
		handleAddedArticulos(value) {
			if(this.elementos[0].nivel > 0){
		      this.elementos[0].noArticulos += this.elementos[0].noArticulos + parseInt(value);
			  this.$emit('increment-articulos', value);
		  	}else if(this.elementos[0].nivel == 1){
				  
			}
	    },
		deleteNodo(indice){
			this.elementos.splice(indice, 1);
		}
	}
}
</script>

<template>
	<v-card class="d-flex flex-column justify-space-between pa-0 align-self-stretch">
	<template v-for="(elemento, indice) in elementos"  >
		<v-row align="start" no-gutters>
			<v-col class="align-self-stretch pa-1 d-flex flex-column align-center" style="border:solid 1px;">
				<p class="mb-3 mt-1 text-center text-h6" :class="textClass">{{ elemento.descripcion?.toUpperCase() }} ({{elemento.clave}}). </p>
				<p> {{elemento.noArticulos}} </p>
				<botonera @delete-nodo="deleteNodo" :elemento="elemento" :indice="indice"/>
			</v-col>
			<v-col  v-if="elemento && elemento.hijos?.length>0" class="align-self-stretch"  cols="8">
				<nodo :elementos="elemento.hijos" @increment-articulos="handleAddedArticulos" />
			</v-col>
		</v-row>
	<div v-if="elemento &&  elemento.nivel==0">
		<br>
	</div>
</template>
</v-card>
</template>
