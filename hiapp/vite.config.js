import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port:3000,
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  define: {
    global: 'window',
  },
})
