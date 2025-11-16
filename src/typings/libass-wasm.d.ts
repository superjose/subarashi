// Type definitions for libass-wasm 4.1.0
// Project: https://github.com/libass/JavascriptSubtitlesOctopus
// Definitions by: Claude Code

export interface SubtitlesOctopusOptions {
  /** The video element to attach listeners to */
  video?: HTMLVideoElement;

  /** The canvas to render the subtitles to */
  canvas?: HTMLCanvasElement;

  /** The URL of the subtitle file to play */
  subUrl?: string;

  /** The content of the subtitle file to play */
  subContent?: string;

  /** The URL of the worker (default: 'libassjs-worker.js') */
  workerUrl?: string;

  /** An array of links to the fonts used in the subtitle */
  fonts?: string[];

  /** Object with all available fonts - Key is font name in lower case, value is link */
  availableFonts?: Record<string, string>;

  /** URL to override fallback font */
  fallbackFont?: string;

  /** Whether to load files in a lazy way via FS.createLazyFile() */
  lazyFileLoading?: boolean;

  /** The amount of time the subtitles should be offset from the video (default: 0) */
  timeOffset?: number;

  /** Function that's called when SubtitlesOctopus is ready */
  onReady?: () => void;

  /** Function called in case of critical error */
  onError?: (error: any) => void;

  /** Whether performance info is printed in the console (default: false) */
  debug?: boolean;

  /** Rendering mode: 'js-blend' | 'wasm-blend' | 'lossy' */
  renderMode?: 'js-blend' | 'wasm-blend' | 'lossy';

  /** Target FPS (default: 24) */
  targetFps?: number;

  /** libass bitmap cache memory limit in MiB (default: 0 - no limit) */
  libassMemoryLimit?: number;

  /** libass glyph cache memory limit in MiB (default: 0 - no limit) */
  libassGlyphLimit?: number;

  /** Scale factor for the subtitles canvas (default: 1.0) */
  prescaleFactor?: number;

  /** The height beyond which the subtitles canvas won't be prescaled (default: 1080) */
  prescaleHeightLimit?: number;

  /** The maximum rendering height of the subtitles canvas (default: 0 - no limit) */
  maxRenderHeight?: number;

  /** If set to true, attempt to discard all animated tags (default: false) */
  dropAllAnimations?: boolean;
}

export class SubtitlesOctopus {
  constructor(options: SubtitlesOctopusOptions);

  /** Set the subtitle to display by its URL */
  setTrackByUrl(url: string): void;

  /** Set the subtitle to display by its content */
  setTrack(content: string): void;

  /** Remove the subtitles */
  freeTrack(): void;

  /** Set the current time for subtitle rendering (when using without video) */
  setCurrentTime(time: number): void;

  /** Dispose of the SubtitlesOctopus instance */
  dispose(): void;
}

declare global {
  interface Window {
    SubtitlesOctopus: typeof SubtitlesOctopus;
  }
}
