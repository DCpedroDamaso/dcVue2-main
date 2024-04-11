<template>
  <div>
    <v-card color="grey-lighten-4" height="100%" rounded="0" flat>
      <v-toolbar density="compact">
        <div class="v-toolbar__prepend">
          <img
            src="http://192.10.1.201:8088/dcWeb3/images/common/logoSoloDC2019.png"
            data-v-inspector="layouts/default.vue:98:17"
            style="max-width: 35px; max-height: 35px"
          />
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-title>REPORTE REQUERIMIENTOS</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn>
          <v-icon icon="mdi-email" size="large" />
        </v-btn>
        <v-btn>
          <span class="v-btn__content" data-no-activator=""
            ><i
              class="mdi-logout mdi v-icon notranslate v-theme--dark text-red lighten-3"
              aria-hidden="true"
              style="font-size: 25px; height: 25px; width: 25px"
            ></i
          ></span>
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-card text="" color="white" style="padding: 12px">
      <v-card text="" color="white" style="padding: 12px">
        <v-row>
          <v-col cols="2" sm="2">
            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || ' ']"
              label="LINEA DE NEGOCIO "
              required
            >
            </v-select>
          </v-col>

          <v-col cols="2" sm="2">
            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="COMPRADOR"
              required
            >
            </v-select>
          </v-col>

          <v-col cols="2" sm="2">
            <v-text-field label="ARTICULO" style=""></v-text-field>
          </v-col>

          <v-col cols="2" sm="2">
            <v-text-field label="PROVEEDOR" style=""></v-text-field>
          </v-col>

          <v-col cols="2" sm="1">
            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="ALMACEN"
              required
            >
            </v-select>
          </v-col>

          <v-col cols="2" sm="1">
            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="BODEGA"
              required
            >
            </v-select>
          </v-col>

          <v-col cols="2" sm="2">
            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="COLOCACION"
              required
            >
            </v-select>
          </v-col>
        </v-row>

        <div>
          <v-btn-toggle
            class="d-flex justify-center mb-6"
            v-model="toggle_multiple"
            background-color="primary"
            dark
            multiple
          >
            <v-btn> + </v-btn>

            <v-btn> 1 </v-btn>

            <v-btn> b </v-btn>

            <v-btn> c </v-btn>
            <v-btn> n </v-btn>
            <v-btn> l </v-btn>

            <v-btn> d </v-btn>
            <v-btn> o </v-btn>
            <v-btn> r </v-btn>
            <v-btn> todos </v-btn>
          </v-btn-toggle>
        </div>

        <div
          class="d-flex justify-center mb-6"
          :loading="loading"
          height="48"
          variant="tonal"
        >
          <v-btn>Button</v-btn>
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>

<script>
export default {
  data: () => ({
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Form is valid");
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
