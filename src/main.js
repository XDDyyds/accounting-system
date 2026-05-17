import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import { seedDefaults } from './db/index.js'
import './styles/global.css'

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
    const msg = err?.message || String(err) || '发生未知错误'
    const el = document.createElement('div')
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#C75B4A;color:#fff;padding:12px 20px;border-radius:10px;z-index:9999;max-width:90vw;font-size:14px;font-family:"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 4px 16px rgba(199,91,74,0.3);'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }

  app.use(createPinia())
  app.use(router)

  seedDefaults().catch(console.error)

  app.mount('#app')
}
