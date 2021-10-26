import store from './store'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { setupElement, setupGlobal } from '@/plugins'

const app = createApp(App)
setupElement(app)
setupGlobal(app)
app.use(router).use(store).mount('#app')
