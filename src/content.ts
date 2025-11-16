/// <reference path="./typings/libass-wasm.d.ts" />
alert('we made it 🐥!')
interface Window {
  subarashiLoaded?: boolean;
}

let observer: MutationObserver | null = null;

function waitForVideo(): Promise<HTMLVideoElement> {
  return new Promise((resolve) => {
    console.log('Waiting for video');
    const video = document.querySelector('video');
    if (video) {
      console.log('Video found');
      resolve(video);
      return;
    }

    observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video) {
        observer?.disconnect();
        console.log('Video found 2');
        resolve(video);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
function loadSubtitleOctopus(video: HTMLVideoElement) {
  // Get extension URLs (only works in content script context)
  const scriptUrl = chrome.runtime.getURL('libass-wasm/subtitles-octopus.js');
  const subUrl = chrome.runtime.getURL('sub.ass');
  const workerUrl = chrome.runtime.getURL('libass-wasm/subtitles-octopus-worker.js');

  console.log('[Subarashi] Script URL:', scriptUrl);
  console.log('[Subarashi] Sub URL:', subUrl);
  console.log('[Subarashi] Worker URL:', workerUrl);

  // Create a wrapper script file as a blob to bypass CSP
  const initCode = `
    (function() {
      console.log('[Subarashi Page Context] Checking for SubtitlesOctopus...');
      console.log('[Subarashi Page Context] window.SubtitlesOctopus:', window.SubtitlesOctopus);

      if (!window.SubtitlesOctopus) {
        console.error('[Subarashi Page Context] SubtitlesOctopus not found on window!');
        return;
      }

      const video = document.querySelector('video');
      if (!video) {
        console.error('[Subarashi Page Context] Video element not found!');
        return;
      }

      console.log('[Subarashi Page Context] Initializing SubtitlesOctopus...');
      try {
        new window.SubtitlesOctopus({
          video: video,
          subUrl: '${subUrl}',
          workerUrl: '${workerUrl}'
        });
        console.log('[Subarashi Page Context] Subtitles initialized successfully!');
      } catch (error) {
        console.error('[Subarashi Page Context] Error initializing:', error);
      }
    })();
  `;

  // First, inject the SubtitlesOctopus library script
  const libScript = document.createElement('script');
  libScript.src = scriptUrl;

  libScript.onerror = (error) => {
    console.error('[Subarashi] Failed to load SubtitlesOctopus library:', error);
  };

  libScript.onload = () => {
    console.log('[Subarashi] SubtitlesOctopus library loaded');

    // Create a blob URL for the init script to bypass CSP inline restrictions
    const blob = new Blob([initCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    const initScript = document.createElement('script');
    initScript.src = blobUrl;

    initScript.onload = () => {
      console.log('[Subarashi] Initialization script executed');
      URL.revokeObjectURL(blobUrl); // Clean up
    };

    initScript.onerror = (error) => {
      console.error('[Subarashi] Failed to execute initialization script:', error);
      URL.revokeObjectURL(blobUrl); // Clean up
    };

    document.head.appendChild(initScript);
  };

  document.head.appendChild(libScript);
  console.log('[Subarashi] Library script tag appended');
}
function main() {

  if (window.subarashiLoaded) {
    console.log('Subarashi already loaded 2');
    return;
  }
  waitForVideo().then((video) => {
    loadSubtitleOctopus(video);
    window.subarashiLoaded = true;
  });
}

main();
