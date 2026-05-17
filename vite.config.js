import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Tells Vite to safely bypass host checks for any incoming tunnel domain
    allowedHosts: true,
    
    // Allows access across your network interface
    host: true,
  }
})