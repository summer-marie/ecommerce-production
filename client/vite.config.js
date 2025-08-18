/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for this mode (safer than direct `process.env` usage)
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3005,
      hmr: {
        port: 3005  // Ensure HMR uses the same port
      }
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

    // Preview configuration for Railway production (allows Railway domains)
    preview: {
      // let Vite listen on the platform-provided port only when provided by the platform
      host: true,
      port: env.PORT ? Number(env.PORT) : undefined,
      // explicitly allow the Railway-generated frontend and backend domains
      allowedHosts: ['client-production-24fd.up.railway.app', 'server-production-6620.up.railway.app', 'localhost']
    }
  }
})