import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  // Plugins for Vite
  plugins: [react()],
  
  // Alias configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Shortcut for 'src' directory
    },
  },

  // Development server settings
  server: {
    port: 3000, // Set the development server port
    open: true, // Automatically open the browser
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Proxy API requests to the backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Build settings
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
  },

  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp', '**/*.PNG'],

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'], // Ensure these are pre-bundled
  },
});
