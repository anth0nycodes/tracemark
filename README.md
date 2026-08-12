# Tracemark

<img src="public/opengraph.png" />

<br />

A Chrome extension that lets you draw over any webpage and export or copy the result as an image.

**[Install from the Chrome Web Store →](https://chromewebstore.google.com/detail/tracemark/mgckpdklnjeklihpmplgcfnhncifikjd)**

Tracemark injects a full-page drawing overlay into the active tab. Annotate anything — articles, dashboards, designs — with a pencil, text, and framing tools, then export the annotated view as a PNG or copy it straight to your clipboard.

## Features

- **Draw over any page** — pencil, line, frame, text, eraser, and a color picker.
- **Edit as you go** — undo, redo, group, and delete your objects.
- **Capture in one click** — copy to clipboard or export as PNG.
- **Stays out of your way** — draggable toolbar, `1`–`7` tool shortcuts, and Interact / Select modes.
- **Private by design** — runs only on the tab you activate, entirely in your browser.

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

| Script       | Description                                   |
| ------------ | --------------------------------------------- |
| `pnpm dev`   | Dev mode with hot reload                      |
| `pnpm build` | Production build                              |
| `pnpm zip`   | Package the extension as a zip                |
| `pnpm check` | Type-check the project (`wxt prepare && tsc`) |
| `pnpm lint`  | Run ESLint                                    |

## Project Structure

```
src/
├── entrypoints/        # background + overlay entrypoints
├── components/         # toolbar, canvas, color picker, popovers, ui
├── context/            # fabric canvas, shadow DOM, toolbar state
│   ├── fabric-canvas/
│   ├── shadow-dom/
│   └── toolbar/        # color, frame, pencil, eraser, text
├── lib/                # helpers + utils
├── App.tsx
└── AppProviders.tsx
```

## How It Works

Clicking the toolbar icon injects an overlay entrypoint into the active tab. The overlay mounts a React app inside a Shadow DOM container, isolating the extension's styles from the host page. A Fabric.js canvas sits on top of the page, and toolbar tools drive canvas state through React context providers. On export, the canvas is serialized to an image for download or clipboard copy.

## License

See [LICENSE](./LICENSE).
