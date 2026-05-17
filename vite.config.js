import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '记账助手',
        short_name: '记账',
        description: '个人记账应用',
        theme_color: '#F9F7F2',
        background_color: '#F9F7F2',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' }]
      }
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{js,ts}']
  }
})
