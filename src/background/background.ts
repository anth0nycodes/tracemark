function handleActionClick(tab: chrome.tabs.Tab) {
  const tabId = tab.id;
  if (!tabId) return;
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["./src/content/content.js"],
  });
}

chrome.action.onClicked.addListener(handleActionClick);
