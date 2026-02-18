import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
          'charts': ['recharts'],
          'query': ['@tanstack/react-query'],
          'icons': ['lucide-react'],
          'state': ['zustand'],
          'date': ['date-fns'],
        },
        // Ensure consistent chunk naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Report bundle size
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      'recharts',
      '@tanstack/react-query',
      'lucide-react',
      'zustand',
      'date-fns',
    ],
  },
  // Performance optimizations for Netlify
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})
