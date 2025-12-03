import browser from "webextension-polyfill";
import { MessageData } from "./typings/types";

async function sendMessage(sendData: MessageData) {
  // Possible performance increase: cache the browser.tabs.query.
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab.id) {
    console.error("[Subarashi Popup] No active tab ID");
    return;
  }

  if (!tab.url?.includes("crunchyroll.com")) {
    console.warn(
      "[Subarashi Popup] Subarashi is only supported on Crunchyroll"
    );
    return;
  }
  await browser.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: (dataString: string) => {
      // This runs in the MAIN world of each frame
      console.log("[Subarashi Injected] Sending load subtitles message");
      const data = JSON.parse(dataString);
      window.postMessage(data, "*");
    },
    args: [JSON.stringify(sendData)],
  });
}

function popup() {
  const loadSubsBtn = document.getElementById("js-load-subtitles");
  const unloadSubsBtn = document.getElementById("js-unload-subtitles");

  if (!loadSubsBtn) {
    console.error("[Subarashi Popup] Load subtitles button not found");
    return;
  }
  if (!unloadSubsBtn) {
    console.error("[Subarashi Popup] Unload subtitles button not found");
    return;
  }

  loadSubsBtn.addEventListener("click", async () => {
    console.log("[Subarashi Popup] Button clicked");

    console.log("[Subarashi Popup] Loading subtitle file...");

    try {
      // Load the subtitle file content
      const subUrl = browser.runtime.getURL("sub.ass");
      const response = await fetch(subUrl);
      const subContent = await response.text();

      console.log(
        "[Subarashi Popup] Subtitle file loaded, length:",
        subContent.length
      );

      // Prepare the message data - we'll use the iframe's existing SubtitlesOctopus files
      const messageData = {
        type: "SUBARASHI_LOAD_SUBTITLES" as const,
        subContent: subContent,
      };

      await sendMessage(messageData);

      console.log("[Subarashi Popup] Sending message to content script...");

      // Inject a script that posts the message with the data
      // We convert the data to a string to pass it into the function

      console.log("[Subarashi Popup] Message sent successfully");
    } catch (error) {
      console.error("[Subarashi Popup] Error:", error);
    }
  });

  unloadSubsBtn.addEventListener("click", async () => {
    await sendMessage({ type: "SUBARASHI_UNLOAD_SUBTITLES" });
  });
}

popup();
