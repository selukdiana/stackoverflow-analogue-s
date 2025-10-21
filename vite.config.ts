import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://codelang.vercel.app/api/',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        secure: false,
      },
      '/server': {
        target: 'https://codelang.vercel.app',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/server/, ''),
        secure: false,
      },
    },
  },
});
