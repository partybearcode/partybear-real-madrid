import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('firebase')) {
            return 'firebase'
          }

          if (id.includes('@e965/xlsx') || id.includes('papaparse') || id.includes('xml2js')) {
            return 'calendar-formats'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('react')) {
            return 'react-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/chatbot': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
