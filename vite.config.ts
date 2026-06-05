import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.jpg'],
      manifest: {
        name: '吃什么 - 饮食决策助手',
        short_name: '吃什么',
        description: '快速筛选、敲定每日三餐，解决选择困难',
        theme_color: '#FAFAF5',
        background_color: '#FAFAF5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          { src: 'icons/icon.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg}'],
      },
    }),
  ],
})
