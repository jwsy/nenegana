import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/nenegana/' : '/',
  server: {
    port: 5173,
    host: true,
  },
})
