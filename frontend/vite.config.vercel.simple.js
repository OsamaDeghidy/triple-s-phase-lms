import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define __dirname for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Simplified Vercel configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  base: '/',
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
})
