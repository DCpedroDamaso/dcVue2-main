<script>
import AuthService from "@/auth/service/Auth.js";
import { useTheme } from "vuetify";
import Swal from "sweetalert2";

export default {
  name: "layout",
  props: {},
  methods: {
    async refresh() {
      console.log("refresh");
      try {
        await refreshNuxtData();
      } catch {
        console.log("error");
      } finally {
      }
    },
    async logout() {
      AuthService.logout();
      await navigateTo("/compras/mantenimientos/reporteRequerimientoV3/login");
    },
  
    
   
  },
  setup() {
    const theme = useTheme();
    return {
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? "light"
          : "dark"),
    };
  },
};
</script>
<script setup></script>
<template>
  <p>A</p>
  <v-layout>
    <v-app-bar color="blue-grey-lighten-4" height="40px">
      <template v-slot:prepend>
        <img
          style="max-width: 35px; max-height: 35px"
          src="http://192.10.1.201:8088/dcWeb3/images/common/logoSoloDC2019.png"
        />

        <!--REPORTE REQUERIMIENTOS-->
      </template>

      <!-- <NuxtLink
        @click="changeRefreshHome(1)"
        to="/compras/mantenimientos/reporteRequerimientoV3/home"
        style="margin-right: 15px"
        class="link"
      >
        <p>REPORTE REQUERIMIENTOS</p>
      </NuxtLink>
     -->
      <div>
        <input
          type="checkbox"
          class="checkbox"
          id="checkbox"
          @change="toggleTheme"
        />
        <label for="checkbox" class="checkbox-label">
          <v-icon
            icon="mdi-moon-waxing-crescent"
            color="yellow"
            size="x-small"
          ></v-icon>
          <v-icon
            icon="mdi-white-balance-sunny"
            color="amber-darken-1"
            size="x-small"
          ></v-icon>
          <span class="ball"></span>
        </label>
      </div>

      
        <slot name="componen">
          
        </slot>
      

      <v-btn @click="logout" color="red-dark-4">
        <v-icon icon="mdi-logout" size="25px" color="red lighten-3"></v-icon
      ></v-btn>


    </v-app-bar>
  </v-layout>

  <v-container fluid> </v-container>

  <slot name="body"></slot>

  <br />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap");

.dropdown .dropdown-menu.dropdown-primary .dropdown-item:hover,
.dropdown .dropdown-menu.dropdown-primary .dropdown-item:active,
.dropdown .dropdown-menu.dropdown-primary .dropdown-item.active,
.dropup .dropdown-menu.dropdown-primary .dropdown-item:hover,
.dropup .dropdown-menu.dropdown-primary .dropdown-item:active,
.dropup .dropdown-menu.dropdown-primary .dropdown-item.active,
.dropleft .dropdown-menu.dropdown-primary .dropdown-item:hover,
.dropleft .dropdown-menu.dropdown-primary .dropdown-item:active,
.dropleft .dropdown-menu.dropdown-primary .dropdown-item.active,
.dropright .dropdown-menu.dropdown-primary .dropdown-item:hover,
.dropright .dropdown-menu.dropdown-primary .dropdown-item:active,
.dropright .dropdown-menu.dropdown-primary .dropdown-item.active {
  background-color: rgb(255, 0, 0) !important;
  color: black !important;
}

body {
  font-family: "Roboto";
  font-size: 14px !important;
}
.menu-desplegable {
  color: black;
}
.link {
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;
  text-align: center;
  padding: 10px;
  color: black;
  font-size: 14px;
}

.link:hover {
  background-color: rgb(159, 155, 152);
}

:root {
  --popper-theme-background-color: #e4e2e2;
  --popper-theme-text-color: #000;
  --popper-theme-padding: 10px;
}
.v-label {
  font-size: 14px;
}

.v-btn--size-default {
  font-size: 14px;
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox-label {
  background-color: #8f8e8e;
  width: 50px;
  height: 26px;
  border-radius: 50px;
  position: relative;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fa-moon {
  color: #f1c40f;
}

.fa-sun {
  color: #f39c12;
}

.checkbox-label .ball {
  background-color: #fff;
  width: 22px;
  height: 22px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

.checkbox:checked + .checkbox-label .ball {
  transform: translateX(24px);
}
</style>
