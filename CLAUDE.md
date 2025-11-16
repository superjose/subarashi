# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Subarashi is a Chrome Manifest V3 extension that loads custom ASS subtitles on Crunchyroll videos using the JavascriptSubtitlesOctopus library.

## Project Structure

```
src/
  popup.html          - Extension popup UI
  popup.ts            - Popup logic
  content.ts          - Content script for Crunchyroll pages
static/
  JavascriptSubtitlesOctopus/  - Third-party subtitle rendering library
  sub.ass             - Subtitle file
manifest.json         - Chrome extension manifest (root)
build/                - Build output directory
```

## Build Commands

```bash
# Production build
pnpm build

# Development watch mode
pnpm dev
```

The build process uses Vite:
- Compiles TypeScript files from `src/` to JavaScript
- Bundles popup.ts with module support
- Preserves IIFE wrapper for content.ts (required for Chrome extension content scripts)
- Copies `manifest.json` from root and static assets from `static/` to build/
- Outputs: `build/popup.html`, `build/popup.js`, `build/content.js`, `build/manifest.json`, etc.

## Architecture

### Two-Part Extension Structure

1. **src/popup.ts/popup.html** - Extension popup UI
   - Simple button interface to trigger subtitle loading
   - Uses `chrome.scripting.executeScript()` to inject content script into active Crunchyroll tab
   - References `content.js` (the compiled output)

2. **src/content.ts** - Content script injected into Crunchyroll pages
   - Guards against multiple loads via `window.subarashiLoaded` flag
   - Waits for video element using MutationObserver
   - Dynamically loads JavascriptSubtitlesOctopus library from `static/JavascriptSubtitlesOctopus/`
   - Initializes subtitle rendering with subtitle file at `sub.ass`
   - MUST preserve IIFE wrapper for Chrome extension compatibility

### Key Technical Details

- **Build Tool**: Vite with vite-plugin-static-copy
- **Vite Config**: Sets `root: 'src'` for source files, copies manifest from root and assets from static/
- **Host Permissions**: Only works on `*://*.crunchyroll.com/*`
- **Web Accessible Resources**: JavascriptSubtitlesOctopus JS files and `sub.ass` are exposed to Crunchyroll pages
- **CSP Policy**: Allows WASM execution via `'wasm-unsafe-eval'` for JavascriptSubtitlesOctopus
- **Subtitle Format**: Uses ASS (Advanced SubStation Alpha) format via JavascriptSubtitlesOctopus
