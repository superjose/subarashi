
function popup() {
  const loadSubsBtn = document.getElementById('js-load-subtitles');
  if (!loadSubsBtn) {
    console.error('Load subtitles button not found');
    return;
  }

  loadSubsBtn.addEventListener('click', async () => {
    console.log('click');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    if (!tab.url?.includes('crunchyroll.com')) {
      console.warn("Subarashi is only supported on Crunchyroll");
      return;
    }

    // await chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['content.js']
    // });
  });
}

popup();


