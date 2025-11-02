import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This build object is new.
  build: {
    // Keep client-side build in 'dist'
    outDir: 'dist',
    // This generates a manifest file needed for SSG
    manifest: true,
  },
  ssr: {
    // Handle CommonJS modules in SSR
    noExternal: ['react-helmet-async']
  },
  server: {
    proxy: {
      '/api/external': {
        target: 'https://api.lightxeditor.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/external/, '/external')
      },
      '/api/lightx-proxy': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    },
    open: true,
  }
})
