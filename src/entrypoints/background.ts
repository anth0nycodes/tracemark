import { defineBackground } from "#imports";

export default defineBackground(() => {
  async function handleActionClick(tab: chrome.tabs.Tab) {
    const tabId = tab.id;
    if (!tabId) return;
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["overlay.js"],
    });
  }

  chrome.action.onClicked.addListener(handleActionClick);
});
