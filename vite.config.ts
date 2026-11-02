import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets so it works out-of-the-box on GitHub Pages
  test: {
    globals: true,
    environment: 'node',
  },
});
