# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Subarashi is a cross-browser (Chrome & Firefox) Manifest V3 extension that loads custom ASS subtitles on Crunchyroll videos using the JavascriptSubtitlesOctopus library.

## Project Structure

```
src/
  popup.html          - Extension popup UI
  popup.ts            - Popup logic (uses webextension-polyfill for cross-browser compatibility)
  content.ts          - Content script for Crunchyroll pages
static/
  JavascriptSubtitlesOctopus/  - Third-party subtitle rendering library
  sub.ass             - Subtitle file
manifest.json         - Chrome extension manifest (root)
manifest-firefox.json - Firefox extension manifest (root)
vite.config.ts        - Vite build config for Chrome
vite.config.firefox.ts - Vite build config for Firefox
build/                - Chrome build output directory
build-firefox/        - Firefox build output directory
```

## Build Commands

```bash
# Chrome production build
pnpm build

# Chrome development watch mode
pnpm dev

# Firefox production build
pnpm build:firefox

# Firefox development watch mode
pnpm dev:firefox

# Build both Chrome and Firefox
pnpm build:all

# Watch both Chrome and Firefox (in parallel)
pnpm dev:all
```

The build process uses Vite:
- Compiles TypeScript files from `src/` to JavaScript
- Bundles popup.ts with module support and webextension-polyfill for cross-browser API compatibility
- Preserves IIFE wrapper for content.ts (required for Chrome extension content scripts)
- **Chrome build**: Copies `manifest.json` from root and static assets from `static/` to `build/`
- **Firefox build**: Copies `manifest-firefox.json` (renamed to manifest.json) and static assets to `build-firefox/`
- Outputs: `popup.html`, `popup.js`, `content.js`, `manifest.json`, etc. in respective build directories

## Architecture

### Two-Part Extension Structure

1. **src/popup.ts/popup.html** - Extension popup UI
   - Simple button interface to trigger subtitle loading
   - Uses `browser.scripting.executeScript()` (via webextension-polyfill) for cross-browser compatibility
   - Injects script into active Crunchyroll tab
   - References `content.js` (the compiled output)

2. **src/content.ts** - Content script injected into Crunchyroll pages
   - Guards against multiple loads via `window.subarashiLoaded` flag
   - Waits for video element using MutationObserver
   - Dynamically loads JavascriptSubtitlesOctopus library from `static/JavascriptSubtitlesOctopus/`
   - Initializes subtitle rendering with subtitle file at `sub.ass`
   - MUST preserve IIFE wrapper for Chrome extension compatibility

### Key Technical Details

- **Build Tool**: Vite with vite-plugin-static-copy
- **Cross-Browser Compatibility**: Uses webextension-polyfill to provide unified `browser.*` API for Chrome and Firefox
- **Vite Configs**:
  - `vite.config.ts`: Chrome build, outputs to `build/`, copies `manifest.json`
  - `vite.config.firefox.ts`: Firefox build, outputs to `build-firefox/`, copies `manifest-firefox.json` (renamed to manifest.json)
- **Manifests**:
  - `manifest.json`: Chrome-specific manifest (standard MV3)
  - `manifest-firefox.json`: Firefox-specific manifest with `browser_specific_settings.gecko` and extension ID
- **Host Permissions**: Only works on `*://*.crunchyroll.com/*`
- **Web Accessible Resources**: JavascriptSubtitlesOctopus JS files and `sub.ass` are exposed to Crunchyroll pages
- **CSP Policy**: Allows WASM execution via `'wasm-unsafe-eval'` for JavascriptSubtitlesOctopus
- **Subtitle Format**: Uses ASS (Advanced SubStation Alpha) format via JavascriptSubtitlesOctopus
- **Firefox Requirements**: Requires Firefox 128+ for `world: "MAIN"` content script support
