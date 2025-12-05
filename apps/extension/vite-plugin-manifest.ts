import type { Plugin } from "vite";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

export function manifestTransform(options: { stripFirefox?: boolean; outDir: string }): Plugin {
  return {
    name: "manifest-transform",
    closeBundle() {
      if (options.stripFirefox) {
        // outDir is relative to the vite root (src/), so we need to resolve from there
        const manifestPath = resolve(__dirname, "src", options.outDir, "manifest.json");
        const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

        // Remove Firefox-specific settings for Chrome build
        delete manifest.browser_specific_settings;

        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log("✓ Removed browser_specific_settings from Chrome manifest");
      }
    },
  };
}
