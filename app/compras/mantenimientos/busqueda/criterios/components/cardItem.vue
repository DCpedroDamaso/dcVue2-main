<script>
    import Swal from 'sweetalert2';
    import Popper from "vue3-popper";
    import {deburr} from 'lodash';
    import VueNumberFormat from 'vue-number-format';
    export default {
        props:{
            articulo: Object,
            palabraBuscada: String
        },
        components:{
            Popper
        },
        emits:['on-free'],
        methods:{
            getImgUrl(articulo) {
                return `https://pedidos.com/myfotos/large/(L)${articulo.trim()}.jpg`;
            },
            procesarDescripcion(desc){
                const palabras = this.palabraBuscada.toUpperCase().split(" ");
                let descripcionModificada = deburr(desc.toUpperCase());
                palabras.forEach((palabra)=>{
                    const arr =  descripcionModificada.split(palabra);
                    descripcionModificada = arr.join(`<span class='bg-warning '>${palabra}</span>`);
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
            }
        }
    }
</script>

<template>
    <div v-if="!articulo.hidden" style="flex-basis:25%;padding:1%;overflow-x: hidden;">
        <div class="card" style="height:350px;padding:10px;overflow:auto;" >
            <div style="display:flex;flex-flow:column nowrap;justify-content:space-around;flex-grow:1;text-align:left;">
                
                <v-icon v-if="articulo.fixedIndex !== -1" icon="mdi-pin" @click="setFree" aria-hidden="true" color="blue"></v-icon>
                <Popper v-if="articulo.disponibilidad === 0"  class="pop"
                    arrow hover placement="left"
                    content="Los articulos sin disponibilidad no forman parte del ordenamiento ni pueden moverse individualmente y siempre se muestran al final.">
                    <v-icon icon="mdi-eye-off" color="red" size="large"></v-icon>
                </Popper>

                <Popper v-if="articulo.esNuevo"  class="nuevo"
                arrow hover placement="right"
                content="Nuevo">
                    <v-icon icon="mdi-star" color="green" width="15px"></v-icon>
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
               
                <h5 style="text-align:center;">
                    {{ articulo.itemNum }} 
                    <button v-clipboard:copy="articulo.itemNum" @click="onCopy" style="padding: 0px 2px;font-size: 1.3rem;border: 1px solid transparent;background-color: transparent;" >
                        <v-icon icon="mdi-content-copy"></v-icon>
                    </button>
                </h5>


                <table>
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
                            <!-- <td>{{vueNumberFormat(articulo.precio, {precision:2})}}</td> -->

                            <td>e</td>
                        </tr>
                        <tr>
                            <td><b>Ponderacion </b>: </td>
                            <td>{{ articulo.ponderacion }}</td>
                        </tr>
                        <tr>
                            <td><b>Disponibilidad </b></td>
                            <!-- <td :class="{'text-danger' : articulo.disponibilidad === 0}"> {{ vueNumberFormat(articulo.disponibilidad, {prefix:'',precision:0}) }}</td> -->
                            <td :class="{'text-danger' : articulo.disponibilidad === 0}"> f</td>
                        </tr>

                    </tbody>
                </table>
                
                <p  v-html="procesarDescripcion(articulo.descripcion)"></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .fa-thumbtack, .pop{
        position: absolute;
        top: 25px;
        left: 25px;
        font-size: 20px;
        cursor: pointer;
    }

    .nuevo{
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    .bundle{
        position: absolute;
        top: 10px;
        right: 40px;
        font-size: 20px;
        cursor: pointer;
    }

    .proteccion{
        position: absolute;
        top: 10px;
        right: 70px;
        font-size: 20px;
        cursor: pointer;
    }

    .pop{
        font-size: 12px;
        background-color: black;
    }

    .fa-eye-slash{
        font-size: 20px;
    }

    
  

</style>