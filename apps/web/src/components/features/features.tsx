import type { ReactNode } from "react";
import Image from "next/image";
import {
  animationStyle,
  hiddenBetween,
  POP_EASE,
  REVEAL_DURATION_MS,
  REVEAL_STAGGER_MS,
  riseIn,
  SECTION_CONTENT_DELAY_MS,
  SECTION_TRIGGER,
  travelFrom,
  travelOffset,
} from "@/lib/motion-sequence";
import { cn } from "@/lib/utils";
import { TriangleGuy } from "../decor/characters";
import { PlayOnView } from "../play-on-view";
import { SectionHeader } from "../section-header";
import { ExportDemo } from "./export-demo";
import { MarkupToolsDemo } from "./markup-tools-demo";
import { StaysOutDemo } from "./stays-out-demo";
import { UndoRedoDemo } from "./undo-redo-demo";

const CARD_COUNT = 4;
// The Product Hunt badge reveals first, pushing the header and cards back a step
const HEADER_DELAY_MS = REVEAL_STAGGER_MS;
const CARDS_DELAY_MS = SECTION_CONTENT_DELAY_MS + HEADER_DELAY_MS;
// When the last card's entrance finishes
const CARDS_LANDED_AT_MS =
  CARDS_DELAY_MS + (CARD_COUNT - 1) * REVEAL_STAGGER_MS + REVEAL_DURATION_MS;

type FeatureCardProps = {
  title: string;
  description: string;
  demo: ReactNode;
  // Wide demos are sized by aspect ratio on mobile so they aren't letterboxed
  isWide?: boolean;
  // Position in the grid, for the staggered entrance
  revealIndex: number;
  className?: string;
};

function FeatureCard({
  title,
  description,
  demo,
  isWide = false,
  revealIndex,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "border-border relative z-10 flex flex-col gap-3 rounded-2xl border bg-white p-3",
        className,
      )}
      style={animationStyle(riseIn(CARDS_DELAY_MS + revealIndex * REVEAL_STAGGER_MS))}
    >
      <PlayOnView
        className={cn(
          "bg-secondary-background relative overflow-hidden rounded-xl md:h-64",
          isWide ? "aspect-[19/8] md:aspect-auto" : "h-60",
        )}
      >
        {demo}
      </PlayOnView>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="font-secondary text-base font-medium md:text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
    </article>
  );
}

export function Features() {
  return (
    <PlayOnView
      as="section"
      {...SECTION_TRIGGER}
      aria-labelledby="features-title"
      className="flex flex-col gap-10 py-16 md:py-24"
    >
      <div className="flex flex-col gap-6">
        <a
          href="https://www.producthunt.com/products/tracemark?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-tracemark"
          className="inline-block h-11"
          style={animationStyle(riseIn(0))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="size-full object-contain"
            alt="Tracemark - The only markup tool you need. | Product Hunt"
            width="250"
            height="54"
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1313455&amp;theme=light&amp;t=1794469546178"
          />
        </a>
        <SectionHeader
          id="features-title"
          delayMs={HEADER_DELAY_MS}
          title="Simple tools, no setup"
          description="Open Tracemark on any tab and start annotating. No accounts, no extra apps."
        />
      </div>

      {/*
        Bento: wide cards sit diagonally on large screens. At tablet width the
        wide cards take full rows with the two narrow ones side by side.
      */}
      <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Peeking over the cards from behind them */}
        <TriangleGuy
          aria-hidden
          lookY={5}
          className="pointer-events-none absolute -top-16 right-16 hidden w-24 md:block"
          // Hidden while the cards fade in (it would show through them), then
          // slides up from behind the top-right card once they've landed
          style={{
            ...travelOffset(0, 70),
            ...animationStyle(
              hiddenBetween(0, CARDS_LANDED_AT_MS),
              travelFrom(CARDS_LANDED_AT_MS, 500, POP_EASE),
            ),
          }}
        />
        <FeatureCard
          revealIndex={0}
          className="md:col-span-2"
          isWide
          title="Markup tools"
          description="Pencil, highlighter, text, frames, and lines, right on top of any webpage."
          demo={<MarkupToolsDemo />}
        />
        <FeatureCard
          revealIndex={1}
          title="Undo & redo"
          description="Step back or forward through your changes and keep going without starting over."
          demo={<UndoRedoDemo />}
        />
        <FeatureCard
          revealIndex={2}
          title="Copy & export"
          description="Copy straight to your clipboard or save as a PNG, ready to share in seconds."
          demo={<ExportDemo />}
        />
        <FeatureCard
          revealIndex={3}
          className="md:col-span-2"
          isWide
          title="Stays out of your way"
          description="The toolbar snaps to any screen edge. Hide the overlay anytime without losing your work."
          demo={<StaysOutDemo />}
        />
      </div>
    </PlayOnView>
  );
}
