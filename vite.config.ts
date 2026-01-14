import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace with your deployed API domain
const API_URL = 'https://geo-tech-backend.onrender.com';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // removes /api prefix
      },
    },
  },
});
