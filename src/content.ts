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

function loadSubtitleOctopus(video: HTMLVideoElement, subContent: string) {
  console.log('[Subarashi] Loading SubtitlesOctopus library...');
  console.log('[Subarashi] Subtitle content length:', subContent.length);

  // Inject the SubtitlesOctopus library
  try {

    new window.subtitlesOctopus.exports({
      video: video,
      subContent: subContent,  // Use subtitle content instead of URL
      // workerUrl: workerUrl
    });
  } catch (error) {
    console.error('[Subarashi] Error loading SubtitlesOctopus:', error);
    console.log(window)
  }
}


// Listen for messages from the popup (via postMessage)
window.addEventListener('message', (event) => {
  // Verify the message is from our extension
  if (event.source !== window) return;

  console.log('[Subarashi] Received message:', event.data);

  if (event.data.type === 'SUBARASHI_LOAD_SUBTITLES') {
    console.log('[Subarashi] Load subtitles command received');

    // const { subContent, scriptUrl } = event.data;

    // if (!subContent || !scriptUrl) {
    //   console.error('[Subarashi] Missing required data in message:', event.data);
    //   return;
    // }


    console.log("Before video pushy");
    waitForVideo().then((video) => {
      loadSubtitleOctopus(video, event.data.subContent);
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
