import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { Welcome } from "./Welcome";

// The theme tokens key off a `dark` class; this page has no toggle, so mirror
// whatever the OS is set to.
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const applyTheme = (isDark: boolean) =>
  document.documentElement.classList.toggle("dark", isDark);

applyTheme(darkQuery.matches);
darkQuery.addEventListener("change", (e) => applyTheme(e.matches));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Welcome />
  </StrictMode>
);
