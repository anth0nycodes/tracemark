import { Toolbar } from "@/components/toolbar";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styles from "../index.css?inline";

// TODO: Make this toolbar draggable and toggleable
// TODO: fix styles being overrided on some sites

let rootContainer: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;

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
    </StrictMode>,
  );
}

function initTracemark() {
  // Prevents duplicate injection requests
  if (rootContainer && shadowRoot) {
    document.body.removeChild(rootContainer);
    rootContainer = null;
    shadowRoot = null;
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

  // Inject toolbar
  createToolbar(shadowRoot);

  document.body.appendChild(rootContainer);
}

initTracemark();
