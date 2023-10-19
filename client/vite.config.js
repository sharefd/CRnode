import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Fonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    react(),
    Fonts({
      google: {
        families: ['Lato', 'Inter', 'Fira Code']
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
