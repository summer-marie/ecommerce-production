import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3005
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          router: ['react-router'],
          ui: ['react-spinners']
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: true,
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.webp'],
  // Preview server optimization
  preview: {
    port: 3006
  }
})
