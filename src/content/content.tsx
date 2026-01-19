import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";
import styles from "../index.css?inline";

// TODO: Make this toolbar draggable and toggleable

let rootContainer: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;

function createCanvas() {
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  document.body.appendChild(canvasContainer);

  Object.assign(canvasContainer.style, {
    position: "relative",
    userSelect: "none",
  });

  createRoot(canvasContainer).render(
    <StrictMode>
      <Canvas />
    </StrictMode>
  );
}

function createToolbar(root: ShadowRoot) {
  // Creates the toolbar container and appends it to the shadow DOM, then appends the content to the toolbar container
  const toolbarContainer = document.createElement("div");
  toolbarContainer.id = "toolbar-container";
  root.appendChild(toolbarContainer);

  // Position toolbar container on screen
  Object.assign(toolbarContainer.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
  });

  createRoot(toolbarContainer).render(
    <StrictMode>
      <Toolbar />
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
  createCanvas();

  // Inject toolbar
  createToolbar(shadowRoot);

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
