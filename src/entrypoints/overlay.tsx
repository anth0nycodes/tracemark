import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { defineContentScript } from "#imports";
import { App } from "@/App";
import { AppProviders } from "@/AppProviders";
import { ShadowContainerProvider } from "@/context/shadow-dom/ShadowContainerProvider";
import styles from "@/index.css?inline";

const HOST_ID = "tracemark-shadow-host";

declare global {
  interface Window {
    __tracemark: { root: Root; host: HTMLDivElement };
  }
}

function injectTracemarkContent(root: ShadowRoot) {
  const tracemarkContentContainer = document.createElement("div");
  tracemarkContentContainer.id = "tracemark-content-container";
  root.appendChild(tracemarkContentContainer);

  Object.assign(tracemarkContentContainer.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    userSelect: "none",
  });

  const tracemarkRoot = createRoot(tracemarkContentContainer);

  tracemarkRoot.render(
    <StrictMode>
      <ShadowContainerProvider container={tracemarkContentContainer}>
        <AppProviders>
          <App />
        </AppProviders>
      </ShadowContainerProvider>
    </StrictMode>
  );

  return tracemarkRoot;
}

function openTracemark() {
  const rootContainer = document.createElement("div");
  rootContainer.id = HOST_ID;

  // Reset inherited styles to prevent host page CSS from affecting our components
  Object.assign(rootContainer.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    fontSize: "16px",
    fontFamily:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    lineHeight: "1.5",
    fontWeight: "400",
    letterSpacing: "normal",
    textTransform: "none",
    zoom: "1",
  });

  // Attach #shadow-root to rootContainer
  const shadowRoot = rootContainer.attachShadow({ mode: "open" });

  // Inject tailwind styles
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  // Inject main tracemark app content
  const tracemarkRoot = injectTracemarkContent(shadowRoot);
  window.__tracemark = { root: tracemarkRoot, host: rootContainer };
  document.body.appendChild(rootContainer);
}

function closeTracemark() {
  window.__tracemark.root.unmount();
  window.__tracemark.host.remove();
  // @ts-expect-error - clearing the toggle sentinel
  delete window.__tracemark;
}

// eslint-disable-next-line react-refresh/only-export-components
export default defineContentScript({
  matches: ["<all_urls>"],
  registration: "runtime",
  main() {
    const tracemarkInstance = window.__tracemark;
    if (tracemarkInstance) {
      closeTracemark();
    } else {
      openTracemark();
    }
  },
});
