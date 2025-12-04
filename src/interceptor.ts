/// <reference path="./typings/global.d.ts" />

// Intercept Web Workers to modify .ass subtitle files from v.vrv.co
(function () {
  console.log("[Subarashi Interceptor] Initializing subtitle interceptor...");

  // Target text to replace
  const ORIGINAL_TEXT =
    "So this is the legendary sandstorm of the Land of Wind.";
  const REPLACEMENT_TEXT = "hello from the replaced script.";

  /**
   * Check if URL is a .ass subtitle file from v.vrv.co
   */
  function isTargetSubtitleUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("vrv.co") && url.toLowerCase().endsWith(".ass")
      );
    } catch {
      return false;
    }
  }

  /**
   * Replace the target text in subtitle content
   */
  function modifySubtitleContent(content: string): string {
    if (content.includes(ORIGINAL_TEXT)) {
      console.log(
        "[Subarashi Interceptor] Found target text, replacing..."
      );
      return content.replace(ORIGINAL_TEXT, REPLACEMENT_TEXT);
    }
    return content;
  }

  /**
   * Create XHR interceptor code that will be injected into the worker
   */
  function createWorkerInterceptorCode(): string {
    return `
    // Worker-side XHR interceptor
    (function() {
      const ORIGINAL_TEXT = ${JSON.stringify(ORIGINAL_TEXT)};
      const REPLACEMENT_TEXT = ${JSON.stringify(REPLACEMENT_TEXT)};

      function isTargetSubtitleUrl(url) {
        try {
          // Handle both absolute and relative URLs
          const urlObj = new URL(url, self.location.href);
          const urlString = urlObj.href.toLowerCase();
          return urlObj.hostname.includes("vrv.co") && urlString.endsWith(".ass");
        } catch (error) {
          console.error("[Subarashi Worker Interceptor] URL parsing error:", error, "URL:", url);
          return false;
        }
      }

      function modifySubtitleContent(content) {
        if (content.includes(ORIGINAL_TEXT)) {
          console.log("[Subarashi Worker Interceptor] Found target text, replacing...");
          return content.replace(ORIGINAL_TEXT, REPLACEMENT_TEXT);
        }
        return content;
      }

      const OriginalXHR = self.XMLHttpRequest;

      self.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        let targetUrl = "";
        let isTargetRequest = false;

        xhr.open = function(method, url, ...args) {
          targetUrl = url;
          isTargetRequest = isTargetSubtitleUrl(url);
          return originalOpen.call(this, method, url, ...args);
        };

        xhr.send = function(...args) {
          if (isTargetRequest) {
            console.log("[Subarashi Worker Interceptor] Intercepting:", targetUrl);

            const originalOnload = this.onload;
            const originalOnreadystatechange = this.onreadystatechange;

            this.onreadystatechange = function(e) {
              if (this.readyState === 4 && this.status === 200) {
                try {
                  const originalResponse = this.responseText;
                  const modifiedResponse = modifySubtitleContent(originalResponse);

                  Object.defineProperty(this, 'responseText', {
                    writable: false,
                    configurable: true,
                    value: modifiedResponse
                  });

                  Object.defineProperty(this, 'response', {
                    writable: false,
                    configurable: true,
                    value: modifiedResponse
                  });
                } catch (error) {
                  console.error("[Subarashi Worker Interceptor] Error:", error);
                }
              }

              if (originalOnreadystatechange) {
                return originalOnreadystatechange.apply(this, arguments);
              }
            };

            this.onload = function(e) {
              if (originalOnload) {
                return originalOnload.apply(this, arguments);
              }
            };
          }

          return originalSend.apply(this, args);
        };

        return xhr;
      };

      console.log("[Subarashi Worker Interceptor] Worker-side interceptor initialized");
    })();
    `;
  }

  // Store original Worker constructor
  const OriginalWorker = window.Worker;

  // Override Worker constructor using a function (not class) to handle async properly
  window.Worker = function (
    scriptURL: string | URL,
    options?: WorkerOptions
  ): Worker {
    console.log("[Subarashi Interceptor] Worker created:", scriptURL);

    // Check if this is the SubtitlesOctopus worker
    const url = scriptURL.toString();
    if (
      url.includes("subtitles-octopus-worker") ||
      url.includes("libass-wasm")
    ) {
      console.log(
        "[Subarashi Interceptor] Intercepting SubtitlesOctopus worker"
      );

      // Synchronously fetch and modify the worker script
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", scriptURL.toString(), false); // Synchronous request
        xhr.send(null);

        if (xhr.status === 200) {
          const workerCode = xhr.responseText;

          // Prepend our interceptor code to the worker script
          const interceptorCode = createWorkerInterceptorCode();
          const modifiedWorkerCode = interceptorCode + "\n" + workerCode;

          // Create a blob with the modified worker code
          const blob = new Blob([modifiedWorkerCode], {
            type: "application/javascript",
          });
          const blobURL = URL.createObjectURL(blob);

          console.log(
            "[Subarashi Interceptor] Created modified worker with interceptor"
          );

          // Create the worker with the modified script
          return new OriginalWorker(blobURL, options);
        } else {
          console.error(
            "[Subarashi Interceptor] Failed to fetch worker script, status:",
            xhr.status
          );
        }
      } catch (error) {
        console.error(
          "[Subarashi Interceptor] Error fetching worker script:",
          error
        );
      }
    }

    // For non-SubtitlesOctopus workers or if fetch failed, use original constructor
    return new OriginalWorker(scriptURL, options);
  } as any;

  // Copy static properties from original Worker
  Object.setPrototypeOf(window.Worker, OriginalWorker);
  window.Worker.prototype = OriginalWorker.prototype;

  console.log(
    "[Subarashi Interceptor] Subtitle interceptor initialized successfully"
  );
})();
