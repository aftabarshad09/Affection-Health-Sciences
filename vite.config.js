import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // In dev, Vite (5173) and the Express backend (5000) are separate
      // processes — forward /api so relative fetch('/api/...') calls work
      // the same way they do in production, where server.js serves both
      // the built frontend and the API from one origin.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // CMS-uploaded product/blog images are served by the Express backend
      // too — proxy them the same way as /api so they resolve in dev.
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})