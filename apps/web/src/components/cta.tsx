import { handwritingFont } from "@/lib/fonts";
import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  POP_EASE,
  REVEAL_STAGGER_MS,
  riseIn,
  SECTION_TRIGGER,
  travelFrom,
  travelOffset,
  writeIn,
} from "@/lib/motion-sequence";
import { cn } from "@/lib/utils";
import { AddToChromeButton } from "./add-to-chrome-button";
import { SquareGuy, TriangleGuy } from "./decor/characters";
import { PlayOnView } from "./play-on-view";
import { TracemarkTile } from "./svgs/logo-mark";

// The panel gets marked up after its content lands, like the product would
const HIGHLIGHT_AT_MS = 500;
const NOTE_AT_MS = 1000;
const ARROW_SHAFT_AT_MS = 1500;
const ARROW_SHAFT_DURATION_MS = 300;

// How far below their resting spot the characters start. Must exceed the
// tallest visible part at any breakpoint (about 94px for the square at md)
// so nothing peeks over the panel's edge before they pop up.
const HIDDEN_BELOW_PANEL_OFFSET = 120;

const CHARACTER_CLASS_NAME = "pointer-events-none absolute";

export function Cta() {
  return (
    <PlayOnView
      as="section"
      {...SECTION_TRIGGER}
      aria-labelledby="cta-title"
      className="bg-secondary-background dot-grid relative mb-16 flex flex-col items-center gap-6 overflow-hidden rounded-3xl px-6 py-14 text-center md:mb-24 md:py-20"
    >
      <TracemarkTile
        aria-hidden
        className="size-16 md:size-20"
        style={animationStyle(riseIn(0))}
      />
      <h2
        id="cta-title"
        className="font-secondary md:text-4xl-plus text-2xl font-medium"
        style={animationStyle(riseIn(REVEAL_STAGGER_MS))}
      >
        Ready to annotate your{" "}
        <span className="relative isolate whitespace-nowrap">
          {/* A hand-drawn highlighter swipe behind the words */}
          <svg
            aria-hidden
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
            className="absolute -inset-x-[4%] bottom-[0.05em] -z-10 h-[0.75em] w-[108%]"
            style={animationStyle(writeIn(HIGHLIGHT_AT_MS, 450))}
          >
            <path
              d="M6 14 C 40 8, 120 6, 194 9 C 198 18, 197 26, 192 33 C 130 36, 60 37, 8 34 C 3 27, 2 20, 6 14 Z"
              opacity="0.7"
              className="fill-brand-yellow"
            />
          </svg>
          first page
        </span>
        ?
      </h2>

      <div
        className="relative"
        style={animationStyle(riseIn(REVEAL_STAGGER_MS * 2))}
      >
        {/* A handwritten note beside the button, with an arrow to it */}
        <svg
          aria-hidden
          viewBox="0 0 150 50"
          className={cn(
            "pointer-events-none absolute -top-1.5 right-full mr-2 hidden w-36 sm:block",
            handwritingFont.className
          )}
        >
          <text
            x="2"
            y="36"
            fontSize="24"
            transform="rotate(-6 2 36)"
            className="fill-brand-red"
            style={animationStyle(writeIn(NOTE_AT_MS, 450))}
          >
            it&apos;s free!
          </text>
          <path
            d="M86 33.2 C 95 27, 104.5 23.4, 116.5 22.6 C 128.5 21.8, 136.5 23.6, 144.2 26.6"
            strokeWidth="2.5"
            className="stroke-brand-red"
            {...drawnStrokeProps}
            style={animationStyle(
              drawIn(ARROW_SHAFT_AT_MS, ARROW_SHAFT_DURATION_MS)
            )}
          />
          <path
            d="M134.6 17.4 C 138.2 20.4, 141.6 23.4, 145 26.6 C 141.2 29, 137.6 31.2, 133.4 33.8"
            strokeWidth="2.5"
            className="stroke-brand-red"
            {...drawnStrokeProps}
            style={animationStyle(
              drawIn(ARROW_SHAFT_AT_MS + ARROW_SHAFT_DURATION_MS, 150)
            )}
          />
        </svg>
        <AddToChromeButton />
      </div>

      {/* Popping up from the bottom corners, looking at the button */}
      <SquareGuy
        aria-hidden
        lookX={5}
        lookY={-4}
        className={cn(
          CHARACTER_CLASS_NAME,
          "-bottom-10 left-[6%] w-20 sm:-bottom-14 sm:left-[8%] sm:w-28 md:-bottom-16 md:w-36"
        )}
        style={{
          ...travelOffset(0, HIDDEN_BELOW_PANEL_OFFSET),
          ...animationStyle(travelFrom(300, 550, POP_EASE)),
        }}
      />
      <TriangleGuy
        aria-hidden
        lookX={-5}
        lookY={-4}
        className={cn(
          CHARACTER_CLASS_NAME,
          "right-[6%] -bottom-12 w-20 sm:right-[8%] sm:-bottom-16 sm:w-28 md:-bottom-20 md:w-36"
        )}
        style={{
          ...travelOffset(0, HIDDEN_BELOW_PANEL_OFFSET),
          ...animationStyle(travelFrom(450, 550, POP_EASE)),
        }}
      />
    </PlayOnView>
  );
}
