import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from local network (mobile testing)
    port: 5173,
    allowedHosts: true, // Allow tunnel hosts
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Hit backend via IP
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
