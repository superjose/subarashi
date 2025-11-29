/// <reference path="./typings/libass-wasm.d.ts" />
import "libass-wasm";
import { SubtitlesOctopus } from "./typings/libass-wasm";

// Extend window type for our usage
declare global {
  interface Window {
    subarashiLoaded?: boolean;
    subtitlesOctopus?: typeof SubtitlesOctopus;
  }
}

// Running in MAIN world (page context), so we have access to chrome.runtime
// but we're in the same JavaScript context as the page

console.log('[Subarashi] Content script loaded in MAIN world');

function waitForVideo(): Promise<HTMLVideoElement> {
  return new Promise((resolve) => {
    console.log('[Subarashi] Waiting for video element...');
    const video = document.querySelector('video');
    if (video) {
      console.log('[Subarashi] Video found immediately');
      resolve(video);
      return;
    }

    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video) {
        observer.disconnect();
        console.log('[Subarashi] Video found via observer');
        resolve(video);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

function getVelocityCanvas(): HTMLCanvasElement | null {
  return document.querySelector('#velocity-canvas');
}

// function createCanvas(velocityCanvas: HTMLCanvasElement): { canvas: HTMLCanvasElement, canvasParent: HTMLDivElement } {
//   const canvas = document.createElement('canvas');
//   canvas.className = 'js-subarashi-canvas';
//   canvas.width = velocityCanvas.width * 2;
//   canvas.height = velocityCanvas.height * 2;
//   canvas.style.position = 'absolute';
//   canvas.style.top = `${-velocityCanvas.height}px`;
//   canvas.style.left = ' 0';
//   canvas.style.pointerEvents = 'none';

//   const canvasParent = document.createElement('div');
//   canvasParent.className = 'js-subarashi-canvas-parent';
//   canvasParent.appendChild(canvas);
//   canvasParent.style.position = 'relative';
//   canvasParent.style.left = '-50%';
//   canvasParent.style.transform = 'translateX(50%)';
//   return { canvas, canvasParent };

// }

// function monitorCanvas(velocityCanvas: HTMLCanvasElement, subarashiCanvas: HTMLCanvasElement) {
//   const observer = new MutationObserver(() => {
//     if (velocityCanvas.width !== subarashiCanvas.width || velocityCanvas.height !== subarashiCanvas.height) {
//       subarashiCanvas.width = velocityCanvas.width;
//       subarashiCanvas.height = velocityCanvas.height;
//     }
//   });
//   observer.observe(velocityCanvas, { attributes: true });
// }

function processLibassCanvas(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    console.error('Libass canvas not found');
    return;
  }
  canvas.style.transform = 'translateX(-50%)';
  canvas.style.left = '50%';
}

function loadSubtitleOctopus(video: HTMLVideoElement, subContent: string) {
  console.log('[Subarashi] Loading SubtitlesOctopus library...');
  console.log('[Subarashi] Subtitle content length:', subContent.length);
  const workerUrl = './assets/libass-wasm/4-0-0/subtitles-octopus-worker.js'
  const velocityCanvas = getVelocityCanvas();
  if (!velocityCanvas) {
    console.error('Crunchyroll\'s Velocity canvas not found');
    return;
  }
  // const { canvas, canvasParent } = createCanvas(velocityCanvas);
  // video.parentElement?.appendChild(canvasParent);
  // monitorCanvas(velocityCanvas, canvas);

  // Initialize SubtitlesOctopus
  try {
    new window.subtitlesOctopus.exports({
      video: video,
      subContent: subContent,
      workerUrl: workerUrl,
      // canvas: canvasParent
    });

    processLibassCanvas(document.querySelector('canvas.libassjs-canvas') as HTMLCanvasElement);

    console.log('[Subarashi] SubtitlesOctopus initialized successfully');
  } catch (error) {
    console.error('[Subarashi] Error loading SubtitlesOctopus:', error);
  }
}


// Listen for messages from the popup (via postMessage)
window.addEventListener('message', (event) => {
  // Verify the message is from our extension
  if (event.source !== window) return;

  console.log('[Subarashi] Received message:', event.data);

  if (event.data.type === 'SUBARASHI_LOAD_SUBTITLES') {
    console.log('[Subarashi] Load subtitles command received');

    const { subContent } = event.data;

    if (!subContent) {
      console.error('[Subarashi] Missing subtitle content in message:', event.data);
      return;
    }

    waitForVideo().then((video) => {
      loadSubtitleOctopus(video, subContent);
    }).catch(error => {
      console.error('[Subarashi] Error loading subtitles:', error);
    });
  }
});

function main() {
  // Prevent multiple loads
  if (window.subarashiLoaded) {
    console.log('[Subarashi] Already loaded, skipping...');
    return;
  }
  window.subarashiLoaded = true;

  console.log('[Subarashi] Content script ready and waiting for commands...');
}

main();
