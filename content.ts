(function() {
  if ((window as any).subarashiLoaded) {
    console.log('Subarashi already loaded');
    return;
  }
  (window as any).subarashiLoaded = true;

  function waitForVideo(): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
      const video = document.querySelector('video');
      if (video) {
        resolve(video);
        return;
      }

      const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
          observer.disconnect();
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
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('JavascriptSubtitlesOctopus/assets/js/subtitles-octopus.js');

    script.onload = () => {
      const SubtitlesOctopus = (window as any).SubtitlesOctopus;

      if (!SubtitlesOctopus) {
        console.error('SubtitlesOctopus not loaded');
        return;
      }

      new SubtitlesOctopus({
        video: video,
        subUrl: chrome.runtime.getURL('static/sub.ass'),
        workerUrl: chrome.runtime.getURL('JavascriptSubtitlesOctopus/assets/js/subtitles-octopus-worker.js')
      });

      console.log('Subtitles loaded successfully');
    };

    document.head.appendChild(script);
  }

  waitForVideo().then(loadSubtitleOctopus);
})();
