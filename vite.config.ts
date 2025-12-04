import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        content: resolve(__dirname, 'src/content.ts'),
        interceptor: resolve(__dirname, 'src/interceptor.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Output content.js and popup.js at root of build/
          return '[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep popup.html at root
          if (assetInfo.name === 'popup.html') {
            return '[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    // Preserve IIFE format for content script
    target: 'es2024',
    minify: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../manifest.json',
          dest: '.',
        },
        {
          src: '../static/JavascriptSubtitlesOctopus',
          dest: '.',
        },
        {
          src: '../static/libass-wasm',
          dest: '.',
        },
        {
          src: '../static/sub.ass',
          dest: '.',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
