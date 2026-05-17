import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { seedDefaults } from './db/index.js'

seedDefaults().catch(console.error)

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
