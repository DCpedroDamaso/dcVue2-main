
<script>
import AuthService from '@/auth/service/Auth.js';
export default {

    name: 'prueba',

    data() {
        return{
            counter:0,
            nomnbre:""
        }
    },
    methods: {
        aumentar(){
            this.counter = this.counter +1
        },
        disminuir(){
            this.counter = this.counter -1
        }
    },

    async mounted(){
        this.counter = 10
    }
}
</script>


<template>
    <NuxtLayout name="default">
      <template #body>

    <v-card class="my-4 content">
      <v-card-title  class="bg-grey-darken-3 ">

                <div class="text-h7 pa-2 content">{{counter}}</div>
                


                <v-btn @click="aumentar()" > +1</v-btn>
                <v-btn @click="disminuir()"> -1</v-btn>


          </v-card-title>
        </v-card>
      </template>
    </NuxtLayout>
 </template>


<style>
</style>

<script setup>

  definePageMeta({
    layout: false,
    middleware: [
    function(to, from) {
        const isAuth = AuthService.isTokenValid();
        if (!isAuth) {
          return navigateTo('/compras/mantenimientos/busquedas/login');
        }
      },
    ]
  });
  

</script>