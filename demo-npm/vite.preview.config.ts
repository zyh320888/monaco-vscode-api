import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      '^/stable-': {
        target: 'ws://localhost:23964',
        ws: true,
        changeOrigin: true
      },
    },
  },
});