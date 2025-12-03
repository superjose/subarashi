/// <reference path="./typings/libass-wasm.d.ts" />
/// <reference path="./typings/global.d.ts" />
import "libass-wasm";
import { MessageData } from "./typings/types";

const WORKER_URL = "./assets/libass-wasm/4-0-0/subtitles-octopus-worker.js";
let subtitlesLoaded = false;

function waitForVideo(): Promise<HTMLVideoElement> {
  return new Promise((resolve) => {
    console.log("[Subarashi] Waiting for video element...");
    const video = document.querySelector("video");
    if (video) {
      console.log("[Subarashi] Video found immediately");
      resolve(video);
      return;
    }

    const observer = new MutationObserver(() => {
      const video = document.querySelector("video");
      if (video) {
        observer.disconnect();
        console.log("[Subarashi] Video found via observer");
        resolve(video);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function getVelocityCanvas(): HTMLCanvasElement | null {
  return document.querySelector("#velocity-canvas");
}

function getLibassCanvas(): HTMLCanvasElement | null {
  return document.querySelector("canvas.libassjs-canvas");
}

function processLibassCanvas(canvas: HTMLCanvasElement | null) {
  if (!canvas) {
    console.error("Libass canvas not found");
    return;
  }
  canvas.style.transform = "translateX(-50%)";
  const setLeftStyle = () => {
    const setLeft = () => {
      requestAnimationFrame(() => {
        canvas.style.left = "50%";
      });
    }
    window.setTimeout(setLeft, 150);
  }

  setLeftStyle();
  window.addEventListener("resize", setLeftStyle);
}

function hideCrunchyCanvas(velocityCanvas: HTMLCanvasElement) {
  velocityCanvas.style.display = "none";
}
function unhideCrunchyCanvas(velocityCanvas: HTMLCanvasElement) {
  velocityCanvas.style.display = "block";

}
function hideLibassCanvas(libassCanvas: HTMLCanvasElement) {
  libassCanvas.style.display = "none";
}
function unhideLibassCanvas(libassCanvas: HTMLCanvasElement) {
  libassCanvas.style.display = "block";
}
function loadSubtitleOctopus(video: HTMLVideoElement, subContent: string) {
  const velocityCanvas = getVelocityCanvas();
  if (!velocityCanvas) {
    console.error("Crunchyroll's Velocity canvas not found");
    return;
  }

  // Initialize SubtitlesOctopus
  try {
    new window.subtitlesOctopus.exports({
      video: video,
      subContent: subContent,
      workerUrl: WORKER_URL,
      // canvas: canvasParent
    });

    processLibassCanvas(
      document.querySelector("canvas.libassjs-canvas") as HTMLCanvasElement
    );
    hideCrunchyCanvas(velocityCanvas);
    subtitlesLoaded = true;
    console.log("[Subarashi] SubtitlesOctopus initialized successfully");
  } catch (error) {
    console.error("[Subarashi] Error loading SubtitlesOctopus:", error);
  }
}

function unloadSubtitles() {
  const velocityCanvas = getVelocityCanvas();
  const libassCanvas = getLibassCanvas();
  if (!velocityCanvas) {
    console.error("Crunchyroll's Velocity canvas not found");
    return;
  }
  if (!libassCanvas) {
    console.error("Libass canvas found, not unloading");
    return;
  }
  unhideCrunchyCanvas(velocityCanvas);
  hideLibassCanvas(libassCanvas);

}

function loadSubtitles() {
  const velocityCanvas = getVelocityCanvas();
  const libassCanvas = getLibassCanvas();
  if (!velocityCanvas) {
    console.error("Crunchyroll's Velocity canvas not found");
    return;
  }
  if (!libassCanvas) {
    console.error("Libass canvas found, not unloading");
    return;
  }
  hideCrunchyCanvas(velocityCanvas);
  unhideLibassCanvas(libassCanvas);
}

// Listen for messages from the popup (via postMessage)
window.addEventListener("message", (event) => {
  // Verify the message is from our extension
  if (event.source !== window) return;

  const data = event.data as MessageData;

  switch (data.type) {
    case "SUBARASHI_LOAD_SUBTITLES": {
      const subContent = data.subContent;
      if (!subContent) {
        console.error(
          "[Subarashi] Missing subtitle content in message:",
          event.data
        );
        return;
      }
      if (subtitlesLoaded) {
        loadSubtitles();
        return;
      }
      waitForVideo()
        .then((video) => {
          loadSubtitleOctopus(video, subContent);
        })
        .catch((error) => {
          console.error("[Subarashi] Error loading subtitles:", error);
        });
    }
    case "SUBARASHI_UNLOAD_SUBTITLES": {
      unloadSubtitles();

      break;
    }
  }

  if (event.data.type === "SUBARASHI_LOAD_SUBTITLES") {
    const { subContent } = event.data;
  }
});

function main() {
  // Prevent multiple loads
  if (window.subarashiLoaded) {
    console.log("[Subarashi] Already loaded, skipping...");
    return;
  }
  window.subarashiLoaded = true;

  console.log("[Subarashi] Content script ready and waiting for commands...");
}

main();
