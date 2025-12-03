import { SubtitlesOctopus } from "./libass-wasm";
// Extend window type for our usage
declare global {
  interface Window {
    subarashiLoaded?: boolean;
    subtitlesOctopus: {
      exports: typeof SubtitlesOctopus;
    };
  }
}
