import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Fonts from 'unplugin-fonts/vite';
import TailwindCSS from 'tailwindcss';
import Autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    Fonts({
      google: {
        families: ['Lato', 'Inter', 'Fira Code']
      }
    })
  ],
  css: {
    postcss: {
      plugins: [TailwindCSS, Autoprefixer]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
