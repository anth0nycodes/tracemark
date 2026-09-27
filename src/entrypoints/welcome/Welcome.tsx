import { useEffect, useState, type ReactNode } from "react";
import {
  Eraser,
  Hand,
  MousePointer2,
  PencilLine,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react";
import { Line } from "@/components/custom-icons/icons";
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
    shortcut: "1",
    description: "Scroll and click the page underneath",
  },
  {
    name: "Select",
    icon: MousePointer2,
    shortcut: "2",
    description: "Move, resize, and group what you drew",
  },
  {
    name: "Pencil",
    icon: PencilLine,
    shortcut: "3",
    description: "Freehand strokes, with size and color",
  },
  {
    name: "Erase",
    icon: Eraser,
    shortcut: "4",
    description: "Rub out parts of a stroke",
  },
  {
    name: "Text",
    icon: Type,
    shortcut: "5",
    description: "Drop a label anywhere on the page",
  },
  {
    name: "Frame",
    icon: Square,
    shortcut: "6",
    description: "Box off the part that matters",
  },
  {
    name: "Line",
    icon: Line,
    shortcut: "7",
    description: "Straight lines for pointing things out",
  },
];

interface Step {
  title: string;
  body: ReactNode;
}

const steps: Step[] = [
  {
    title: "Pin Tracemark to your toolbar",
    body: "Click the puzzle-piece icon in Chrome's toolbar, then pin Tracemark so it's one click away.",
  },
  {
    title: "Open any page and click the Tracemark icon",
    body: "A drawing overlay and a draggable toolbar appear on top of the page. Click the icon again, or the X at the end of the toolbar, to close it.",
  },
  {
    title: "Pick a tool and draw",
    body: "Pencil, erase, text, and frame each open a popover for color, size, and style. Interact lets the page through; Select grabs what you drew.",
  },
  {
    title: "Copy or export",
    body: "Copy the annotated view straight to your clipboard, or export it as a PNG. Clear wipes the canvas and starts over.",
  },
];

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="bg-muted border-border text-foreground inline-flex min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  );
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="border-border flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-sm">
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
    <main className="bg-background text-foreground mx-auto max-w-3xl px-6 pt-16 pb-24">
      <header className="flex flex-col items-center gap-4 text-center">
        <img src="/icon128.png" alt="" className="size-16" />
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome to Tracemark
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Draw over any webpage, then copy or export the result as an image.
          Annotate articles, dashboards, and designs without leaving the tab.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Getting started
        </h2>
        <ol className="grid gap-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-border flex items-start gap-3 rounded-lg border px-4 py-3.5"
            >
              <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Tools</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="border-border flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
            >
              <tool.icon aria-hidden="true" className="size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{tool.name}</p>
                <p className="text-muted-foreground text-xs">
                  {tool.description}
                </p>
              </div>
              <Kbd>{tool.shortcut}</Kbd>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Shortcuts</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Shortcut label="Copy to clipboard" keys={[mod, "C"]} />
          <Shortcut label="Undo" keys={[mod, "Z"]} />
          <Shortcut label="Redo" keys={redoKeys} />
          <Shortcut label="Group selection" keys={[mod, "G"]} />
          <Shortcut label="Delete selection" keys={["Backspace"]} />
        </div>
      </section>

      <div className="bg-muted border-border text-muted-foreground mt-12 space-y-2 rounded-lg border p-4 text-sm">
        <p>
          <strong className="text-foreground font-medium">Good to know.</strong>{" "}
          Tracemark only runs on the tab you activate it on, and everything stays
          in your browser — nothing is uploaded. Drawings aren't saved, so copy
          or export before you close the overlay or reload the page.
        </p>
        <p>
          Chrome blocks extensions on its own pages (<code>chrome://</code> URLs,
          the Chrome Web Store, and other extensions' pages), so the overlay
          won't open there.
        </p>
      </div>

      <footer className="text-muted-foreground mt-12 text-center text-sm">
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
      </footer>
    </main>
  );
}
