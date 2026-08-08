import { browser, defineBackground } from "#imports";
import type { Browser } from "wxt/browser";

export default defineBackground(() => {
  async function handleActionClick(tab: Browser.tabs.Tab) {
    const tabId = tab.id;
    if (!tabId) return;
    await browser.scripting.executeScript({
      target: { tabId },
      files: ["/overlay.js"],
    });
  }

  browser.action.onClicked.addListener(handleActionClick);

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "CAPTURE_VISIBLE_TAB") {
      return browser.tabs.captureVisibleTab({ format: "png" });
    }
  });
});
