# Contributing to Tracemark

Thanks for your interest in contributing! This guide covers how to set up the project, the workflow we follow, and the conventions to keep in mind.

## Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [pnpm](https://pnpm.io) — the required package manager

## Setup

1. **Fork** the repo on GitHub, then **clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/tracemark.git
   cd tracemark
   ```
2. **Add the upstream remote** so you can pull in the latest changes:
   ```bash
   git remote add upstream https://github.com/anth0nycodes/tracemark.git
   ```
   Confirm your remotes — `origin` should point to your fork, `upstream` to the main repo:
   ```bash
   git remote -v
   ```
3. **Install dependencies and start dev mode:**
   ```bash
   pnpm install
   pnpm dev:extension   # or `pnpm dev:web` for the landing page
   ```
   `pnpm dev:extension` launches a browser with the extension loaded and hot reload enabled. Run all commands from the repo root.

### Keeping your fork in sync

Before starting new work, pull the latest from upstream so your branch is based on current `main`:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

## Development Workflow

1. **Create a branch** off `main` for your change:
   ```bash
   git checkout -b feat/short-description
   ```
2. **Make your change.** Keep it focused — one concern per pull request.
3. **Verify locally** before opening a PR:
   ```bash
   pnpm check   # type-check the extension (wxt prepare && tsc --noEmit)
   pnpm lint    # eslint, both apps
   pnpm build   # confirm both apps build
   ```
4. **Test the extension manually** in the browser — draw, erase, add text, frame, export, and copy to confirm nothing regressed.
5. **Push your branch** to your fork:
   ```bash
   git push origin name/feature-short-description
   ```
6. **Open a pull request** from your fork's branch against the upstream `main`, with a clear description of what changed and why.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add stroke width slider to pencil tool
fix: prevent removeChild crash on overlay close
chore: bump extension versions
```

Keep the subject line concise (≤ 50 chars)

## Code Style

- **TypeScript** everywhere — no untyped escapes without reason.
- **Formatting** is handled by Prettier (with import sorting and the Tailwind plugin). Run your editor's format-on-save or format before committing.
- **Linting** via ESLint — `pnpm lint` must pass.
- **Imports are explicit** — WXT auto-imports are disabled in this project (`imports: false`). Import everything directly; use the `@` alias for `src` (e.g. `@/components/toolbar`).
- **Styling** with Tailwind CSS 4 and shadcn/ui components.

## Project Structure

```
apps/
├── extension/              # the Chrome extension (WXT + React)
│   └── src/
│       ├── entrypoints/    # background, overlay, and welcome entrypoints
│       ├── components/     # toolbar, canvas, color picker, popovers, ui
│       ├── context/        # fabric canvas, shadow DOM, theme, toolbar state
│       │   ├── fabric-canvas/
│       │   ├── shadow-dom/
│       │   ├── theme/
│       │   └── toolbar/    # color, frame, pencil, highlighter, eraser, text
│       ├── lib/            # helpers + utils
│       ├── App.tsx
│       └── AppProviders.tsx
└── web/                    # the landing page (Next.js)
```

Toolbar tools follow a consistent pattern: a context provider under `apps/extension/src/context/toolbar/<tool>/` (state + hook + constants) paired with a popover UI in `apps/extension/src/components/popovers/`. Match this shape when adding a new tool.

## Reporting Issues

When filing a bug, include:

- Browser and version
- The webpage or scenario where it happens
- Steps to reproduce
- Expected vs. actual behavior
- Console errors, if any

Thanks for contributing! 🎉
