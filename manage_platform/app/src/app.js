import "./assets/css/app.scss";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuetify
import vuetify from './plugins/vuetify'; 

const pinia = createPinia();

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(pinia)
app.mount('#app')
