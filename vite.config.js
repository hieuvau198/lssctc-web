import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
// Remove or comment out this import: import tailwind from '@tailwindcss/vite'; 

// ADD these imports for PostCSS plugins
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(), 
    // REMOVE the plugin call: tailwind(),
  ],
  // REMOVED: css: { transformer: 'postcss', },

  // ADD this block to explicitly use Tailwind via PostCSS
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Manually load Tailwind as a PostCSS plugin
        autoprefixer(),
      ],
    },
  },
  server: {
    open: true,
  },
})