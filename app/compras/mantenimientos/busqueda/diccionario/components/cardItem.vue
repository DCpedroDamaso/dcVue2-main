<script>
    import Swal from 'sweetalert2';
    import Popper from "vue3-popper";
    import {deburr} from 'lodash';
    export default {
        props:{
            articulo: Object,
            palabraBuscada: String,
            pins:Array,
            sinonimos: Array,
        },
        components:{
            Popper,
        },
        emits:['on-free'],
        methods:{
            getImgUrl(articulo) {
                return `https://pedidos.com/myfotos/large/(L)${articulo.trim()}.jpg`;
            },
            procesarDescripcion(desc){
                const palabras = this.palabraBuscada.toUpperCase().split(" ");
                const sinonimos=this.sinonimos
                let descripcionModificada = deburr(desc.toUpperCase());
                let i =0;
                let existeCoincidencia =false;
                palabras.forEach((palabra)=>{
                    
                });
                if(deburr(desc.toUpperCase()).includes(this.palabraBuscada.toUpperCase()) ){
                        existeCoincidencia = true
                        i++;
                    }
                let arr
                if(existeCoincidencia){
                    palabras.forEach((palabra)=>{
                    const arr =  descripcionModificada.split(palabra);
                    
                });
                arr =  descripcionModificada.split(this.palabraBuscada.toUpperCase());
                descripcionModificada = arr.join(`<span class='bg-yellow-darken-1 '>${this.palabraBuscada.toUpperCase()}</span>`);
                }
                sinonimos.forEach((palabra)=>{
                    const arr =  descripcionModificada.split(palabra.toUpperCase());
                    descripcionModificada = arr.join(`<span class='bg-pink-lighten-1'>${palabra.toUpperCase()}</span>`);
                });



                return descripcionModificada;
            },
            setFree(){
                this.$emit('on-free',this.articulo.itemNum);
            }, 
            onCopy(){
                const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-start',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
                })

                Toast.fire({
                icon: 'success',
                title: 'Se ha copiado el articulo'
                })
            },
            tieneCoincidenciaConPalabra(descripcion){
                let existeCoincidencia =false;
                const palabras = this.palabraBuscada.toUpperCase().split(" ");

                let i = 0
                palabras.forEach((palabra)=>{
                    if(deburr(descripcion.toUpperCase()).includes(palabra) ){
                        existeCoincidencia = true
                        i++;
                    }
                });
                const sinonimos=this.sinonimos
                let a = 0
                sinonimos.forEach((sinonimo)=>{
                    if(deburr(descripcion.toUpperCase()).includes(sinonimo) ){
                        a++;
                    }
                });
                if(existeCoincidencia && i == palabras.length  && a ==0){
                    return "palabra"
                }else if(existeCoincidencia && i == palabras.length && a >0){
                    return "palabra-and-sinonimo"
                }else{
                    return "sinonimo"
                }
            }
        }
    }
</script>

<template>
    <v-card v-if="!articulo.hidden"  class="pa-1 ma-1 sombra-card" style="flex-basis:23%;padding:1%; overflow-x: hidden;" :class="tieneCoincidenciaConPalabra(articulo.descripcion)" >
        <div class="card" style="height:350px;padding:10px;overflow:auto;" >
            <div style="display:flex;flex-flow:column nowrap;justify-content:space-around;flex-grow:1;text-align:left;">
                <!-- <i v-if="articulo.fixedIndex !== -1" class="fa fa-thumbtack text-primary" @click="setFree" aria-hidden="true"></i> -->
                <v-icon v-if="pins.includes(articulo.itemNum)" icon="mdi-pin" @click="setFree" aria-hidden="true" color="blue"></v-icon>
                <Popper v-if="articulo.disponibilidad === 0"  :class="pins.includes(articulo.itemNum) ? 'pop2': 'pop'"
                    arrow hover placement="left"
                    content="Los articulos sin disponibilidad no forman parte del ordenamiento ni pueden moverse individualmente y siempre se muestran al final.">
                    <v-icon icon="mdi-eye-off" color="red" size="large"></v-icon>
                </Popper>

                <Popper v-if="articulo.esNuevo"  class="nuevo"
                arrow hover placement="right"
                content="Nuevo">
                    <v-icon icon="mdi-star" color="green" size="large"></v-icon>
                </Popper>

                <Popper v-if="articulo.tieneBundle"  class="bundle"
                arrow hover placement="right"
                content="Bundle">
                    <v-icon icon="mdi-gift" color="blue"></v-icon>
                </Popper>

                <Popper v-if="articulo.tieneProteccion"  class="proteccion"
                arrow hover placement="right"
                content="Protegido">
                    <v-icon icon="mdi-tag" color="red"></v-icon>
                </Popper>


                <img :src="getImgUrl(articulo.itemNum)" width="100" style="align-self: center;">
               
                <div class="text-h7" style="text-align:center; font-weight: 900;">
                    {{ articulo.itemNum }} 
                    <!-- <button v-clipboard:copy="articulo.itemNum" @click="onCopy" style="padding: 0px 2px;font-size: .8rem;border: 1px solid transparent;background-color: transparent;" >
                        <v-icon icon="mdi-content-copy"></v-icon>
                    </button> -->
                </div>


                <table class="table-cardItem">
                    <tbody>
                        <tr>
                            <td><b>Marca</b>:</td>
                            <td>{{ articulo.marca }}</td>
                        </tr>
                        <tr>
                            <td><b>Categoria</b>:</td>
                            <td>{{ articulo.familia }}</td>
                        </tr>
                        <tr>
                            <td><b>Precio</b>:</td>
                            <td> $ {{articulo.precio.toFixed(2)}}</td>
                            <!-- <td> $ {{vueNumberFormat(articulo.precio, {precision:2, prefix: '$ ', decimal: '.', thousand: ','})}}</td> -->
                        </tr>
                        <tr>
                            <td><b>Ponderacion </b>: </td>
                            <td>{{ articulo.ponderacion }}</td>
                        </tr>
                        <tr>
                            <td><b>Disponibilidad </b></td>
                            <!-- <td :class="{'text-red' : articulo.disponibilidad === 0}"> {{ vueNumberFormat(articulo.disponibilidad, {prefix:'',precision:0}) }}</td> -->
                            <td :class="{'text-red' : articulo.disponibilidad === 0}"> {{ articulo.disponibilidad }}</td>
                        </tr>

                    </tbody>
                </table>
                
                <p  class="descripcion" v-html="procesarDescripcion(articulo.descripcion)"></p>
            </div>
        </div>
    </v-card>
</template>

<style scoped>
    :root{
        --popper-theme-background-color:#fff;
        --popper-theme-text-color: #000;
    }
    .descripcion{
        font-size: 0.8rem;
    }
    .table-cardItem{
        font-size: .9rem;
    }
    .sombra-card{
        box-shadow: rgba(22, 22, 22, 0.594) 0px 0px 5px 0px, rgba(255, 255, 255, 0.807) 0px 0px 2px 0px;
    }
    .fa-thumbtack, .pop{
        position: absolute;
        top: 28px;
        left: 25px;
        cursor: pointer;
        font-size: 12px;
    }
    .pop2{
        position: absolute;
        top: 50px;
        left: 25px;
        font-size: 12px;
        cursor: pointer;
    }

    .nuevo{
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }
    .bundle{
        position: absolute;
        top: 10px;
        right: 40px;

        cursor: pointer;
    }
    .proteccion{
        position: absolute;
        top: 10px;
        right: 70px;

        cursor: pointer;
    }
    .pop{

    }
    .fa-eye-slash{
        font-size: 20px;
    }
    .palabra{
       border: 1px solid #FDD835;
    }
    .sinonimo{
        border: 1px solid #EC407A;
    }
    .palabra-and-sinonimo{
        border: 1px solid #81C784;
    }
</style>