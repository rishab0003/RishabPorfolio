import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        'lanyard-entry': './js/lanyard-entry.jsx',
        'grainient-entry': './js/grainient-entry.jsx',
      },
      formats: ['iife'],
    },
    outDir: 'js',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        // Inline CSS into JS to avoid separate CSS files
        inlineDynamicImports: false,
      },
    },
    minify: false,
    cssCodeSplit: true,
  },
});
