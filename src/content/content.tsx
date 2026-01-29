import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import styles from "../index.css?inline";

// TODO: Make this toolbar draggable and toggleable

let rootContainer: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;

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

  createRoot(tracemarkContentContainer).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

function initTracemark() {
  if (rootContainer) {
    console.warn("Tracemark has already been initialized!");
    return;
  }

  rootContainer = document.createElement("div");
  rootContainer.id = "tracemark-shadow-host";

  // Position the shadow host to cover the entire document
  Object.assign(rootContainer.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  });

  // Attach #shadow-root to rootContainer
  shadowRoot = rootContainer.attachShadow({ mode: "open" });

  // Inject tailwind styles
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  // Inject main tracemark app content
  injectTracemarkContent(shadowRoot);

  document.body.appendChild(rootContainer);

  return () => cleanup();
}

function cleanup() {
  // Prevents duplicate injection requests
  // TODO: Fix the cleanup logic when you click the extension icon if it's already initialized
  if (rootContainer) {
    rootContainer.remove();
    rootContainer = null;
    shadowRoot = null;
    return;
  }
}

initTracemark();
