import { useEffect, useState, type ReactNode } from "react";
import {
  Eraser,
  Hand,
  Highlighter,
  MousePointer2,
  PencilLine,
  Square,
  type LucideIcon,
} from "lucide-react";
import { HandDrawnStar, StickerFilterDefs } from "@/components/brand/hand-drawn-star";
import { SquareGuy } from "@/components/brand/square-guy";
import { TracemarkLogo } from "@/components/brand/tracemark-logo";
import { Line, Text } from "@/components/custom-icons/icons";
import type { CustomIcon } from "@/components/custom-icons/icons";
import { getOS } from "@/lib/helpers";

interface Tool {
  name: string;
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  description: string;
}

const tools: Tool[] = [
  {
    name: "Interact",
    icon: Hand,
    shortcut: "i",
    description: "Scroll and click the page underneath",
  },
  {
    name: "Select",
    icon: MousePointer2,
    shortcut: "v",
    description: "Move, resize, and group what you drew",
  },
  {
    name: "Pencil",
    icon: PencilLine,
    shortcut: "p",
    description: "Freehand strokes, with size and color",
  },
  {
    name: "Highlighter",
    icon: Highlighter,
    shortcut: "h",
    description: "Translucent strokes to mark up text",
  },
  {
    name: "Erase",
    icon: Eraser,
    shortcut: "e",
    description: "Rub out parts of a stroke",
  },
  {
    name: "Text",
    icon: Text,
    shortcut: "t",
    description: "Drop a label anywhere on the page",
  },
  {
    name: "Frame",
    icon: Square,
    shortcut: "f",
    description: "Box off the part that matters",
  },
  {
    name: "Line",
    icon: Line,
    shortcut: "l",
    description: "Straight lines for pointing things out",
  },
];

interface Step {
  title: string;
  body: ReactNode;
  // Each step number gets circled in the next brand color, like a marker would
  circleClassName: string;
}

const steps: Step[] = [
  {
    title: "Pin Tracemark to your toolbar",
    body: "Click the puzzle-piece icon in Chrome's toolbar, then pin Tracemark so it's one click away.",
    circleClassName: "stroke-brand-red",
  },
  {
    title: "Open any page and click the Tracemark icon",
    body: "A drawing overlay and a draggable toolbar appear on top of the page. Click the icon again, or the X at the end of the toolbar, to close it.",
    circleClassName: "stroke-brand-blue",
  },
  {
    title: "Pick a tool and draw",
    body: "Pencil, highlighter, erase, text, and frame each open a popover for color, size, and style. Interact lets the page through; Select grabs what you drew.",
    circleClassName: "stroke-brand-green",
  },
  {
    title: "Copy or export",
    body: "Copy the annotated view straight to your clipboard, or export it as a PNG. Clear wipes the canvas and starts over.",
    circleClassName: "stroke-brand-yellow",
  },
];

function CircledNumber({ value, circleClassName }: { value: number; circleClassName: string }) {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center">
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="absolute inset-0">
        <path
          d="M16.6 3.2 C 23.5 3, 28.8 9, 28.5 16.2 C 28.2 23.6, 22.5 28.8, 15.6 28.5 C 8.6 28.2, 3.4 22.8, 3.6 15.8 C 3.8 9.4, 8.4 3.8, 18.4 4.6"
          strokeWidth="2.2"
          strokeLinecap="round"
          className={circleClassName}
        />
      </svg>
      <span className="font-display relative text-sm font-semibold">{value}</span>
    </span>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="font-display mb-4 text-2xl font-medium">{children}</h2>;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-accent border-border text-foreground inline-flex min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 py-0.5 font-mono text-xs capitalize">
      {children}
    </kbd>
  );
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="border-border bg-background flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm">
      <span>{label}</span>
      <span className="flex shrink-0 gap-1">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </span>
    </div>
  );
}

export function Welcome() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    getOS().then((os) => setIsMac(os === "macOS"));
  }, []);

  const mod = isMac ? "⌘" : "Ctrl";
  const redoKeys = isMac ? ["⌘", "⇧", "Z"] : ["Ctrl", "Y"];

  return (
    <main className="bg-background text-foreground mx-auto max-w-3xl px-6 pt-10 pb-24">
      <StickerFilterDefs />

      <TracemarkLogo role="img" aria-label="Tracemark" className="h-7 w-auto" />

      {/* Hero panel: a dotted canvas that's already been marked up */}
      <header className="bg-accent dot-grid border-border relative mt-8 overflow-hidden rounded-3xl border px-6 pt-14 pb-24 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <HandDrawnStar
          aria-hidden="true"
          className="pointer-events-none absolute top-5 left-5 w-9 -rotate-12"
        />
        <p
          aria-hidden="true"
          className="font-hand text-brand-red absolute top-6 right-6 rotate-6 text-2xl"
        >
          you&apos;re all set!
        </p>

        <h1 className="font-display text-4xl font-medium sm:text-5xl">
          Welcome to{" "}
          <span className="relative isolate whitespace-nowrap">
            {/* A hand-drawn highlighter swipe behind the name */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
              className="absolute -inset-x-[4%] bottom-[0.05em] -z-10 h-[0.75em] w-[108%]"
            >
              <path
                d="M6 14 C 40 8, 120 6, 194 9 C 198 18, 197 26, 192 33 C 130 36, 60 37, 8 34 C 3 27, 2 20, 6 14 Z"
                className="fill-brand-yellow opacity-70 dark:opacity-35"
              />
            </svg>
            Tracemark
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
          Draw over any webpage, then copy or export the result as an image. Annotate articles,
          dashboards, and designs without leaving the tab.
        </p>

        {/* Peeking up from the bottom edge, looking at the headline */}
        <SquareGuy
          aria-hidden="true"
          lookX={-4}
          lookY={-4}
          className="pointer-events-none absolute right-[8%] -bottom-12 w-24"
        />
      </header>

      <section className="mt-14">
        <SectionHeading>Getting started</SectionHeading>
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-border bg-background flex items-start gap-3 rounded-2xl border p-4"
            >
              <CircledNumber value={index + 1} circleClassName={step.circleClassName} />
              <div className="pt-1">
                <p className="font-semibold">{step.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <SectionHeading>Tools</SectionHeading>
        <div className="grid gap-2 sm:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="border-border bg-background flex items-center gap-3 rounded-xl border p-2.5 pr-3.5"
            >
              <span className="bg-accent flex size-9 shrink-0 items-center justify-center rounded-lg">
                <tool.icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{tool.name}</p>
                <p className="text-muted-foreground text-xs">{tool.description}</p>
              </div>
              <Kbd>{tool.shortcut}</Kbd>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading>Shortcuts</SectionHeading>
        <div className="grid gap-2 sm:grid-cols-2">
          <Shortcut label="Copy canvas to clipboard" keys={["⇧", "C"]} />
          <Shortcut label="Copy selection" keys={[mod, "C"]} />
          <Shortcut label="Paste at cursor" keys={[mod, "V"]} />
          <Shortcut label="Undo" keys={[mod, "Z"]} />
          <Shortcut label="Redo" keys={redoKeys} />
          <Shortcut label="Group selection" keys={[mod, "G"]} />
          <Shortcut label="Delete selection" keys={["Backspace"]} />
          <Shortcut label="Hide / show overlay" keys={[mod, "."]} />
        </div>
      </section>

      <div className="bg-accent border-border text-muted-foreground mt-14 space-y-2 rounded-2xl border p-5 text-sm">
        <p>
          <strong className="text-foreground font-medium">Good to know.</strong> Tracemark only runs
          on the tab you activate it on, and everything stays in your browser — nothing is uploaded.
          Drawings aren't saved, so copy or export before you close the overlay or reload the page.
        </p>
        <p>
          Chrome blocks extensions on its own pages (<code>chrome://</code> URLs, the Chrome Web
          Store, and other extensions' pages), so the overlay won't open there.
        </p>
      </div>

      <footer className="text-muted-foreground border-border mt-14 flex flex-col items-center gap-3 border-t pt-8 text-center text-sm">
        <TracemarkLogo aria-hidden="true" className="h-5 w-auto" />
        <p>
          Found a bug or have an idea?{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href="https://github.com/anth0nycodes/tracemark/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open an issue on GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
