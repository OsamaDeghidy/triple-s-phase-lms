import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vercel configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
  },
  base: '/',
  define: {
    'process.env': {},
    global: 'globalThis',
  },
})
