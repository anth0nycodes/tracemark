import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PlayOnView } from "../play-on-view";
import { ExportDemo } from "./export-demo";
import { MarkupToolsDemo } from "./markup-tools-demo";
import { StaysOutDemo } from "./stays-out-demo";
import { UndoRedoDemo } from "./undo-redo-demo";

type FeatureCardProps = {
  title: string;
  description: string;
  demo: ReactNode;
  // Wide demos are sized by aspect ratio on mobile so they aren't letterboxed
  isWide?: boolean;
  className?: string;
};

function FeatureCard({
  title,
  description,
  demo,
  isWide = false,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "border-border flex flex-col gap-3 rounded-2xl border bg-white p-3",
        className
      )}
    >
      <PlayOnView
        className={cn(
          "bg-secondary-background relative overflow-hidden rounded-xl md:h-64",
          isWide ? "aspect-[19/8] md:aspect-auto" : "h-60"
        )}
      >
        {demo}
      </PlayOnView>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="font-secondary text-base font-medium md:text-lg">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}

export function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="flex flex-col gap-10 py-16 md:py-24"
    >
      <div className="flex flex-col gap-2 md:items-center md:text-center">
        <h2
          id="features-title"
          className="font-secondary md:text-4xl-plus text-2xl font-medium"
        >
          Simple tools, no setup
        </h2>
        <p>
          Open Tracemark on any tab and start annotating. No accounts, no extra
          apps.
        </p>
      </div>

      {/*
        Bento: wide cards sit diagonally on large screens. At tablet width the
        wide cards take full rows with the two narrow ones side by side.
      */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          className="md:col-span-2"
          isWide
          title="Markup tools"
          description="Pencil, highlighter, text, frames, and lines, right on top of any webpage."
          demo={<MarkupToolsDemo />}
        />
        <FeatureCard
          title="Undo & redo"
          description="Step back or forward through your changes and keep going without starting over."
          demo={<UndoRedoDemo />}
        />
        <FeatureCard
          title="Copy & export"
          description="Copy straight to your clipboard or save as a PNG, ready to share in seconds."
          demo={<ExportDemo />}
        />
        <FeatureCard
          className="md:col-span-2"
          isWide
          title="Stays out of your way"
          description="The toolbar snaps to any screen edge. Hide the overlay anytime without losing your work."
          demo={<StaysOutDemo />}
        />
      </div>
    </section>
  );
}
