import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(), 
    tailwind(),
  ],
  // ADDED: Explicitly set the CSS transformer to 'postcss' 
  // to bypass the problematic native 'lightningcss' module.
  css: {
    transformer: 'postcss', 
  },
  server: {
    open: true,
  },
})
