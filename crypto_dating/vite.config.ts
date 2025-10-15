import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,
    cors: true, // Enable CORS
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Laravel backend URL
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  optimizeDeps: {
    include: ['lucide-vue-next'],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'lucide-icons': ['lucide-vue-next']
        }
      }
    }
  }
});