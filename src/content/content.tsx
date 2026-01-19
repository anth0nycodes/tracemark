import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import styles from "../index.css?inline";

// TODO: Make this toolbar draggable and toggleable

let rootContainer: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;

function createCanvas(root: ShadowRoot) {
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  root.appendChild(canvasContainer);

  Object.assign(canvasContainer.style, {
    position: "relative",
    userSelect: "none",
  });

  createRoot(canvasContainer).render(
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

  // Attach #shadow-root to rootContainer
  shadowRoot = rootContainer.attachShadow({ mode: "open" });

  // Inject tailwind styles
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  // Inject canvas
  createCanvas(shadowRoot);

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
