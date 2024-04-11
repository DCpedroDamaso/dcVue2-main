<script>
import AuthService from "@/auth/service/Auth.js";
import Swal from "sweetalert2";
export default {
  name: "login",
  methods: {
    async login() {
      try {
        const response = await AuthService.login(this.username, this.password);
        window.localStorage.clear();
        window.localStorage.setItem("jwtToken", response.data.access_token);

        let token = localStorage.getItem("jwtToken");
        const tokenParsed = JSON.parse(atob(token.split(".")[1]));
        console.log(tokenParsed);
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: tokenParsed.nombre,
          showConfirmButton: false,
          timer: 1000,
        });
        await navigateTo("/compras/mantenimientos/reporteRequerimientoV3/home");
      } catch {
        this.loginError = true;
      }
    },
  },
  data() {
    return {
      username: "",
      password: "",
      loginError: false,
    };
  },
};
</script>

<template>
  <div class="gradiant">
    <v-container class="container">
      <div class="d-flex flex-column">
        <h1
          style="font-weight: 300"
          class="h3 mb-3 font-weight-normal text-center"
        >
          Inicio de Sesi&oacute;n
        </h1>

        <!-- <form @submit.prevent="login" > -->
        <v-form validate-on="submit lazy" @submit.prevent="login">
          <div class="d-flex flex-column" style="width: 300px; margin: 0 auto">
            <div class="d-flex flex-column mb-3">
              <img
                style="max-width: 80px; max-height: 80px"
                class="ma-auto mb-5"
                src="http://192.10.1.201:8088/dcWeb3/images/common/logoSoloDC2019.png"
              />
              <v-text-field
                v-model="username"
                label="Usuario"
                name="username"
                id="username"
                @keydown.enter.prevent="login"
              ></v-text-field>
              <!-- <label for="username" class=" mb-2">Usuario</label> 
                        <input type="text" name="username" id="username"
                            class="form-control form-control-sm" v-model="username" required autofocus>  -->
            </div>
            <div class="d-flex flex-column mb-3">
              <v-text-field
                v-model="password"
                label="Contraseña"
                name="password"
                id="password"
                type="password"
                @keydown.enter.prevent="login"
              ></v-text-field>
              <!-- <label for="password" class=" mb-2">Contraseña</label>
                        <input type="password" name="password" id="password" v-model="password"
                            class="form-control form-control-sm" required> -->
            </div>
            <v-btn
              color="blue-darken-1"
              @click="login"
              class="btn btn-primary btn-block mt-3"
              variant="outlined"
              >Ingresar</v-btn
            >
            <p v-if="loginError" style="text-align: center; color: brown">
              Usuario o contraseña erronea
            </p>
          </div>

          <p class="mt-5 mb-3 text-muted text-center">
            DC Mayorista S.A. de C.V.&#174;
          </p>
        </v-form>
        <!-- </form> -->
      </div>
    </v-container>
  </div>
  <div></div>
</template>
<style>
.gradiant {
  width: 100%;
  height: 100%;
  background: linear-gradient(#99dbf194, 30%, #ffffff00);
}
</style>

<script setup>
definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      const isAuth = AuthService.isTokenValid();
      if (isAuth) {
        return navigateTo(
          "/compras/mantenimientos/reporteRequerimientoV3/home"
        );
      }
    },
  ],
});
</script>
