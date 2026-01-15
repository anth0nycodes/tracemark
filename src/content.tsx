import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toolbar } from "@/components/toolbar";
import "@/index.css";

// Create a container for the extension
const container = document.createElement("div");
container.id = "tracemark-root";
container.style.cssText = `
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483647;
  pointer-events: auto;
`;

document.body.appendChild(container);

// Render the toolbar
const root = createRoot(container);
root.render(
  <StrictMode>
    <Toolbar />
  </StrictMode>,
);
