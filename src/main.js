import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(GoogleLogin, {
  clientId: '1069979014769-6rp1isa3hqb50188pbjhmrd0gm3093q0.apps.googleusercontent.com',
})

app.mount('#app')
