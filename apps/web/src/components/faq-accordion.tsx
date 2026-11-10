"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  animationStyle,
  riseIn,
  SECTION_CONTENT_DELAY_MS,
} from "@/lib/motion-sequence";
import { cn } from "@/lib/utils";

// A tighter stagger than cards: rows are short and close together
const ROW_STAGGER_MS = 50;
// Moves fast and settles, so opening feels responsive
const PANEL_TRANSITION =
  "duration-250 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none";

type FaqAccordionProps = {
  items: { question: string; answer: ReactNode }[];
};

/*
 * One answer open at a time. Each answer slides by animating its grid row
 * from 0fr to 1fr, which works in every browser (including Safari) in both
 * directions. Native <details> can't animate closing, and its height
 * transition relies on `interpolate-size`, which Safari doesn't support.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idPrefix = useId();

  return (
    <div className="mx-auto w-full max-w-2xl">
      {items.map(({ question, answer }, itemIndex) => {
        const isOpen = openIndex === itemIndex;
        const buttonId = `${idPrefix}-question-${itemIndex}`;
        const panelId = `${idPrefix}-answer-${itemIndex}`;

        return (
          <div
            key={question}
            className="border-border border-b"
            style={animationStyle(
              riseIn(SECTION_CONTENT_DELAY_MS + itemIndex * ROW_STAGGER_MS)
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : itemIndex)}
                className="hover:text-foreground-hover focus-visible:outline-primary flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="font-secondary text-base md:text-lg">
                  {question}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 transition-transform",
                    PANEL_TRANSITION,
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              // Closed answers can't be tabbed into or read out
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows]",
                PANEL_TRANSITION,
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground pb-4 leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
