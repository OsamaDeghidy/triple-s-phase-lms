import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define __dirname for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Optimized Vercel configuration to handle rollup issues
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    })
  ],
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
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          antd: ['antd', '@ant-design/icons'],
          utils: ['axios', 'dayjs', 'date-fns', 'yup', 'formik'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 2000,
  },
  base: '/',
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react',
      'react-dom',
      'react-router-dom',
    ],
    exclude: ['@rollup/plugin-commonjs'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: ['console', 'debugger'],
  },
  ssr: {
    noExternal: ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
  // Additional configuration for Vercel
  server: {
    fs: {
      strict: false,
    },
  },
})
