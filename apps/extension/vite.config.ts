import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";
import { manifestTransform } from "./vite-plugin-manifest";

// Determine browser target from environment variable
const isFirefox = process.env.BROWSER === "firefox";
const outDir = isFirefox ? "../build-firefox" : "../build";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: "src",
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/main.html"),
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
            if (assetInfo.name === "main.html") {
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
    // Optional: explicitly define environment variables for the client
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      // Add other env vars as needed
    },
  };
});
