import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";
import { manifestTransform } from "./vite-plugin-manifest";

// Determine browser target from environment variable
const isFirefox = process.env.BROWSER === "firefox";
const outDir = isFirefox ? "../build-firefox" : "../build";

export default defineConfig({
  root: "src",
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Output content.js and popup.js at root of build/
          return "[name].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Keep popup.html at root
          if (assetInfo.name === "popup.html") {
            return "[name].[ext]";
          }
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
    // Preserve IIFE format for content script
    target: "es2024",
    minify: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "../manifest.json",
          dest: ".",
        },
        {
          src: "../static/JavascriptSubtitlesOctopus",
          dest: ".",
        },
        {
          src: "../static/libass-wasm",
          dest: ".",
        },
        {
          src: "../static/sub.ass",
          dest: ".",
        },
      ],
    }),
    // Only strip Firefox settings for Chrome builds
    manifestTransform({ stripFirefox: !isFirefox, outDir }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
