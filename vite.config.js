import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// CORRECTED: Change import to use the official PostCSS package for Tailwind v4
// NOTE: We name it 'tailwindcss' for convenience, but it imports the new package
import tailwindcss from '@tailwindcss/postcss'; 
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(), 
  ],
  // This explicitly instructs Vite to use PostCSS for CSS processing.
  css: {
    postcss: {
      plugins: [
        // CORRECTED: Now this calls the function from @tailwindcss/postcss
        tailwindcss(), 
        autoprefixer(),
      ],
    },
  },
  server: {
    open: true,
  },
})