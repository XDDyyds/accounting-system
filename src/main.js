import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import { seedDefaults } from './db/index.js'

function checkIndexedDB() {
  if (!window.indexedDB) {
    document.body.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; font-family: sans-serif;">
        <p style="font-size:48px;">⚠️</p>
        <h2>浏览器不支持</h2>
        <p>您的浏览器不支持本地存储（IndexedDB），请使用现代浏览器，或关闭无痕/隐私模式后重试。</p>
      </div>
    `
    return false
  }
  return true
}

if (checkIndexedDB()) {
  const app = createApp(App)

  app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err, info)
  }

  app.use(createPinia())
  app.use(router)

  seedDefaults().catch(console.error)

  app.mount('#app')
}
