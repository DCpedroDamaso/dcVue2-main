import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as labsComponents from 'vuetify/labs/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

//Plugin de Vuetify para ocuparlo donde sea y no tener que hacer importaciones
export default defineNuxtPlugin((app) => {
const vuetify = createVuetify({
  ssr: true,
  theme: { defaultTheme: 'dark' },
  components:{
    ...components,
    ...labsComponents
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});
app.vueApp.use(vuetify);
});



