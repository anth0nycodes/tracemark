# Tracemark

<img src="apps/extension/public/opengraph.png" />

<br />

A Chrome extension that lets you draw over any webpage and export or copy the result as an image.

**[Install from the Chrome Web Store →](https://chromewebstore.google.com/detail/tracemark/mgckpdklnjeklihpmplgcfnhncifikjd)**

Tracemark injects a full-page drawing overlay into the active tab. Annotate anything — articles, dashboards, designs — with pencil, highlighter, text, and framing tools, then export the annotated view as a PNG or copy it straight to your clipboard.

## Features

- **Draw over any page** — pencil, highlighter, line, frame, text, eraser, and a color picker.
- **Edit as you go** — undo, redo, copy, paste, group, and delete your objects.
- **Capture in one click** — copy to clipboard or export as PNG.
- **Stays out of your way** — toolbar that snaps to any screen edge, single-key tool shortcuts, Interact / Select modes, and a hotkey to hide the overlay without losing your work.
- **Light and dark themes** — follows your system by default; your choice is remembered across sites.
- **Private by design** — runs only on the tab you activate, entirely in your browser.
- **Onboards on install** — a welcome page walks through the tools and shortcuts.

## Controls

Click the toolbar icon to open the overlay on the current tab; click it again to close.

| Tool        | Key | What it does                           |
| ----------- | --- | -------------------------------------- |
| Interact    | `I` | Scroll and click the page underneath   |
| Select      | `V` | Move, resize, and group what you drew  |
| Pencil      | `P` | Freehand strokes, with size and color  |
| Highlighter | `H` | Translucent strokes to mark up text    |
| Erase       | `E` | Rub out parts of a stroke              |
| Text        | `T` | Drop a label anywhere on the page      |
| Frame       | `F` | Box off the part that matters          |
| Line        | `L` | Straight lines for pointing things out |

Pencil, Highlighter, Erase, Text, and Frame each open a popover for color, size, and style.

| Shortcut         | Action                   |
| ---------------- | ------------------------ |
| `⇧C`             | Copy canvas to clipboard |
| `⌘C` / `Ctrl+C`  | Copy selection           |
| `⌘V` / `Ctrl+V`  | Paste at cursor          |
| `⌘Z` / `Ctrl+Z`  | Undo                     |
| `⌘⇧Z` / `Ctrl+Y` | Redo                     |
| `⌘G` / `Ctrl+G`  | Group selection          |
| `Backspace`      | Delete selection         |
| `⌘.` / `Ctrl+.`  | Hide / show overlay      |

Copy, Export (PNG), Clear, and the light/dark theme toggle live on the secondary toolbar.

Drag the toolbar by its handle to move it. It snaps to the nearest screen edge — horizontal on the top and bottom, vertical on the left and right — and collapses into a small circle while you pull it between edges.

Hiding the overlay with `⌘.` / `Ctrl+.` keeps your drawings, undo history, and active tool intact while the page works normally. Closing it does not — drawings aren't saved, so copy or export before closing the overlay or reloading the page.

## Tech Stack

- [WXT](https://wxt.dev) — extension framework and build tooling
- [React 19](https://react.dev) + TypeScript
- [Fabric.js 7](http://fabricjs.com) — canvas engine
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Motion](https://motion.dev) — animations

## Getting Started

Requires [pnpm](https://pnpm.io) (see `packageManager` in `package.json`).

```bash
# install dependencies
pnpm install

# run in dev mode
pnpm dev
```

`pnpm dev` launches a browser with the extension loaded and hot reload enabled.

## Build

```bash
# production build
pnpm build

# package as a distributable zip
pnpm zip
```

Build output lands in `.output/`.

## Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `pnpm dev`      | Dev mode with hot reload                      |
| `pnpm build`    | Production build                              |
| `pnpm zip`      | Package the extension as a zip                |
| `pnpm check`    | Type-check the project (`wxt prepare && tsc`) |
| `pnpm lint`     | Run ESLint                                    |
| `pnpm checkall` | Run `check`, `lint`, and `build` in sequence  |

## Project Structure

```
src/
├── entrypoints/        # background, overlay, and welcome entrypoints
├── components/         # toolbar, canvas, color picker, popovers, ui
├── context/            # fabric canvas, shadow DOM, theme, toolbar state
│   ├── fabric-canvas/
│   ├── shadow-dom/
│   ├── theme/          # light/dark theme, persisted to extension storage
│   └── toolbar/        # color, frame, pencil, highlighter, eraser, text
├── lib/                # helpers + utils
├── App.tsx
└── AppProviders.tsx
```

## How It Works

Clicking the toolbar icon injects an overlay entrypoint into the active tab. The overlay mounts a React app inside a Shadow DOM container, isolating the extension's styles from the host page. A Fabric.js canvas sits on top of the page, and toolbar tools drive canvas state through React context providers. On export, the canvas is serialized to an image for download or clipboard copy.

The theme is applied as a `dark` class on the overlay's content container inside the shadow root, and the user's choice is saved to `chrome.storage.local` so it carries across every site.

On first install, the background script opens `welcome.html` — a standalone React page that introduces the tools and shortcuts.

## License

See [LICENSE](./LICENSE).
