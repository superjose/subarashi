import browser from "webextension-polyfill";
import { MessageData } from "../typings/types";

export async function sendMessage(sendData: MessageData) {
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
      const data = JSON.parse(dataString);
      window.postMessage(data, "*");
    },
    args: [JSON.stringify(sendData)],
  });
}
