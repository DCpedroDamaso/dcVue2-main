<script>
import sinonimosService from '../services/SinonimosService.js';
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
    name:'formulario',
    emits: ['refresh','closeDialog'],
    methods: {
        async crearKeyword(theme){
            this.$emit('closeDialog')
            const err = this.validarLayout();
            if(err !==''){
                showErrorModal(err,theme)
                return;
            }

            const lista =  this.construirLista();
            const response = await sinonimosService.saveItems(lista);

            if(response.err !==''){
                const error = response.err.message
                showErrorModal(error,theme)
                return;
            }
            showSuccessModal(response.data,theme)

            this.$emit('refresh');
        },
        validarLayout(){
            const lineas = this.layout.split('\n');
            console.log(lineas)
            if(lineas.length ===0) return;
            let error = '';

            lineas.forEach(function (value, i) {
                const columnas = value.split('\t');
                console.log(columnas)
                if(columnas.length < 2){
                    error +=  `\nLa linea ${i+1} no tiene sinonimos asociados`;
                }
            });

            return error;
        },
        construirLista(){
            const lineas = this.layout.split('\n');
            const lista = [];
            if(lineas.length===0) return;

            lineas.forEach(function (value, i) {
                const columnas = value.split('\t');
                const palabra = columnas[0];
                const sinonimos = [];
                
                columnas.forEach(function (valor, j) {
                    if(j>0 && valor.trim().length > 0)
                        sinonimos.push(valor.trim());   
                });

                lista.push({palabra,sinonimos})
            });

            return lista;
        },
        toggleHelp(){
            this.showHelp = !this.showHelp;
        }
    },
    data() {
        return {
            layout: '',
            showHelp:false,
        }
    },
}
</script>


<template>
    <v-row width="800">
        <v-col cols="12">
        <div class="d-flex justify-center">

                <v-icon icon="mdi-help-circle-outline" @click="toggleHelp()" ></v-icon>

        </div>
        </v-col>
    </v-row>

    <div v-if="showHelp" class="row">
        <div class="col-10 offset-1">
            <v-table class="table table-striped table-sm table-bordered table-hover ">
                <thead class="stylish-color text-white">
                    <tr>
                        <th>Palabra principal</th>
                        <th>Sinonimo 1</th>
                        <th>Sinonimo 2</th>
                        <th>...</th>
                        <th>Sinonimo n</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>pantalla</td>
                        <td>televisor</td>
                        <td>tv</td>
                        <td>...</td>
                        <td>monitor</td>
                    </tr>
                    <tr>
                        <td>lapíz</td>
                        <td>lapicero</td>
                        <td>pencil</td>
                        <td>...</td>
                        <td></td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>

    <v-row  class="w-75 d-flex justify-center mx-auto" >
        <v-textarea id="layoutSinonimos" label="Layout" class="" v-model="layout"></v-textarea>
    </v-row>
    <v-card-actions>
          <v-btn color="blue" block @click="crearKeyword(theme.global.name.value)" variant="outlined">Crear</v-btn>
        </v-card-actions>
    <!-- <button type="button" class="btn btn-elegant" @click="crearKeyword">Crear</button> -->
</template>
<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();


</script>

<style>
.spin{
    -webkit-transform-origin: 50% 50%;
    transform-origin:50% 50%;
    -ms-transform-origin:50% 50%; /* IE 9 */
    -webkit-animation: spin 2s infinite linear;
    -moz-animation: spin 2s infinite linear;
    -o-animation: spin 2s infinite linear;
    animation: spin 2s infinite linear;
    cursor: pointer;
}

@-moz-keyframes spin {
    from {
      -moz-transform: rotate(0deg);
    }
    to {
      -moz-transform: rotate(360deg);
    }
  }
  
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>../../../services/SinonimosService../../../services/sinonimos/SinonimosService