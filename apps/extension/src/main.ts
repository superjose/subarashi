/**
 * The main JavaScript entry function for the extension
 */

import browser from "webextension-polyfill";
import { AppContext, getContext } from "./shared/context";
import { sendMessage } from "./shared/message";
import { api } from "./api/api";

function load(context: AppContext) {
  const loadSubsBtn = document.getElementById("js-load-subtitles");
  if (!loadSubsBtn) {
    console.error("[Subarashi Popup] Load subtitles button not found");
    return;
  }
  loadSubsBtn.addEventListener("click", async () => {
    console.log("[Subarashi Popup] Button clicked");

    console.log("[Subarashi Popup] Loading subtitle file...");

    try {
      // Load the subtitle file content
      // const subUrl = browser.runtime.getURL("sub.ass");
      // const response = await fetch(subUrl);
      // const subContent = await response.text();

      const result = await context.httpClient.get(
        api.subtitles.chapters("GYQ4MW246", "G6Q4MK3GR")
      );
      const subContent = await result.text();
      console.log("Sub content", subContent);

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
}
function unload() {
  const unloadSubsBtn = document.getElementById("js-unload-subtitles");

  if (!unloadSubsBtn) {
    console.error("[Subarashi Popup] Unload subtitles button not found");
    return;
  }

  unloadSubsBtn.addEventListener("click", async () => {
    await sendMessage({ type: "SUBARASHI_UNLOAD_SUBTITLES" });
  });
}

function main() {
  const context = getContext();
  load(context);
  unload();
}

main();
