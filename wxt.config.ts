import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  // Keep all imports explicit — no auto-imports scanning src/components etc.
  imports: false,
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  manifest: {
    name: "Tracemark",
    description:
      "A Chrome extension that lets you draw over any webpage and copy the result as an image.",
    version: "1.0",
    action: {
      default_title: "Open Tracemark",
    },
    icons: {
      16: "icon16.png",
      32: "icon32.png",
      48: "icon48.png",
      128: "icon128.png",
    },
    permissions: ["activeTab", "scripting"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
