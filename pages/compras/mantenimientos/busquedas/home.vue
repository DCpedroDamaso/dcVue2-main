<script>
import AuthService from '@/auth/service/Auth.js';
import { useRefreshData } from '@/store/refreshData'
import { mapState } from 'pinia'
export default {
    computed:{
      ...mapState(useRefreshData,['refresHome'])
    },
    name: 'layout',
    props: {
    },
    methods: {
      miMetodo(){
        console.log()
      }
    },
    data(){
      return{
        a:0
      }
    },
    
    }
</script>

<template>
    <NuxtLayout name="default">
      <template #body>

    <v-card class="my-4 content">
      <v-card-title  class="bg-grey-darken-3 d-flex  align-center">
              <v-icon icon="mdi-home" size="large"></v-icon>
          <div class="text-h7 pa-2 content">Home</div>

      </v-card-title>
    </v-card>

      </template>


    </NuxtLayout>
   
 </template>

<style>
  .content{
    width: 97%;
    height: 100%;
    margin: 0 auto;
    border-radius: 10px;
  }
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