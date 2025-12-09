import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // <-- This allows access from your phone
    port: 5173       // Keep your existing port
  }
})
