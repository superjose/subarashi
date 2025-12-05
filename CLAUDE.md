# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Subarashi is a cross-browser (Chrome & Firefox) Manifest V3 extension that loads custom ASS subtitles on Crunchyroll videos using the JavascriptSubtitlesOctopus library.

## Project Structure

This is a monorepo using Turbo. The extension code is located at `apps/extension/`.

```
apps/extension/
  src/
    popup.html          - Extension popup UI
    popup.ts            - Popup logic (uses webextension-polyfill for cross-browser compatibility)
    content.ts          - Content script for Crunchyroll pages
  static/
    JavascriptSubtitlesOctopus/  - Third-party subtitle rendering library
    sub.ass             - Subtitle file
  manifest.json         - Unified manifest for both Chrome & Firefox
  vite.config.ts        - Vite build config (supports both browsers via BROWSER env var)
  vite-plugin-manifest.ts - Custom Vite plugin to strip Firefox settings for Chrome
  build/                - Chrome build output directory
  build-firefox/        - Firefox build output directory
```

## Build Commands

Run these commands from the root of the monorepo:

```bash
# Chrome production build
bun run build

# Chrome development watch mode
bun run dev

# Firefox production build (from apps/extension)
cd apps/extension && bun run build:firefox

# Firefox development watch mode (from apps/extension)
cd apps/extension && bun run dev:firefox

# Build both Chrome and Firefox (from apps/extension)
cd apps/extension && bun run build:all

# Watch both Chrome and Firefox in parallel (from apps/extension)
cd apps/extension && bun run dev:all
```

The build process uses Vite:
- Compiles TypeScript files from `src/` to JavaScript
- Bundles popup.ts with module support and webextension-polyfill for cross-browser API compatibility
- Preserves IIFE wrapper for content.ts (required for Chrome extension content scripts)
- Uses `BROWSER` environment variable to determine target browser
- **Chrome build** (default): Outputs to `build/`, strips `browser_specific_settings` via custom Vite plugin
- **Firefox build** (`BROWSER=firefox`): Outputs to `build-firefox/`, keeps `browser_specific_settings` intact
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

- **Monorepo Setup**: Uses Turbo for task orchestration and Bun as package manager
- **Build Tool**: Vite with vite-plugin-static-copy and custom manifest transform plugin
- **Cross-Browser Compatibility**: Uses webextension-polyfill to provide unified `browser.*` API for Chrome and Firefox
- **Vite Config**:
  - Single `vite.config.ts` supports both browsers via `BROWSER` environment variable
  - Chrome build (default): outputs to `build/`, uses `vite-plugin-manifest.ts` to strip Firefox-specific settings
  - Firefox build (`BROWSER=firefox`): outputs to `build-firefox/`, keeps manifest unchanged
- **Unified Manifest**:
  - Single `manifest.json` works for both browsers
  - Contains `browser_specific_settings.gecko` for Firefox (extension ID, minimum version 128+)
  - Chrome build automatically removes `browser_specific_settings` via custom Vite plugin
- **Host Permissions**: Only works on `*://*.crunchyroll.com/*`
- **Web Accessible Resources**: JavascriptSubtitlesOctopus JS files and `sub.ass` are exposed to Crunchyroll pages
- **CSP Policy**: Allows WASM execution via `'wasm-unsafe-eval'` for JavascriptSubtitlesOctopus
- **Subtitle Format**: Uses ASS (Advanced SubStation Alpha) format via JavascriptSubtitlesOctopus
- **Firefox Requirements**: Requires Firefox 128+ for `world: "MAIN"` content script support
