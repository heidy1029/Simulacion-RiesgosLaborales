import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/juegos/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tangara.gov.co/ws_pme/?respuestaJuego',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
