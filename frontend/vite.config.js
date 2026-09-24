import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the PHP API runs on :8000 (see /README.md) and is proxied here,
// so the React app can call /api/... exactly as it will on the live server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8000' },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
