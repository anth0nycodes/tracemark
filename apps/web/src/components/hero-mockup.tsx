import { Caveat } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  TOOLBAR_LENGTH,
  TOOLBAR_THICKNESS,
  ToolbarMockup,
} from "./toolbar-mockup";

// Handwriting for the annotations only. Not part of the UI type system.
const caveat = Caveat({ subsets: ["latin"], weight: "600" });

// Converts the extension's real CSS pixels into mockup units. It is sized so
// the full toolbar fits the page area below the browser chrome (y 36 to 420),
// and the frame annotation reuses it so both match the product's proportions.
const EXTENSION_SCALE = 0.54;
const MOCKUP_WIDTH = 640;
const PAGE_TOP = 36;
const PAGE_HEIGHT = 384;
// The Frame tool's rectangle (apps/extension canvas.tsx: rx 12, strokeWidth 4)
const FRAME_CORNER_RADIUS = 12 * EXTENSION_SCALE;
const FRAME_STROKE_WIDTH = 4 * EXTENSION_SCALE;
const TOOLBAR_EDGE_GAP = 20;
const TOOLBAR_X =
  MOCKUP_WIDTH - (TOOLBAR_THICKNESS + TOOLBAR_EDGE_GAP) * EXTENSION_SCALE;
const TOOLBAR_Y =
  PAGE_TOP + (PAGE_HEIGHT - TOOLBAR_LENGTH * EXTENSION_SCALE) / 2;

type RevealTiming = {
  delayMs: number;
  durationMs: number;
  className: string;
};

// Props for a stroke that draws itself in. Duration should scale with the
// stroke's length so every mark is drawn at a similar pen speed.
function drawnStroke({ delayMs, durationMs, className }: RevealTiming) {
  return {
    pathLength: 1,
    strokeDasharray: 1,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("animate-draw motion-reduce:animate-none", className),
    style: {
      animationDelay: `${delayMs}ms`,
      animationDuration: `${durationMs}ms`,
    },
  };
}

// Props for handwritten text that is written in left to right.
function writtenText({ delayMs, durationMs, className }: RevealTiming) {
  return {
    className: cn("animate-write motion-reduce:animate-none", className),
    style: {
      animationDelay: `${delayMs}ms`,
      animationDuration: `${durationMs}ms`,
    },
  };
}

// The arrow's head starts the moment its shaft finishes.
const ARROW_SHAFT_DELAY_MS = 1600;
const ARROW_SHAFT_DURATION_MS = 450;

export function HeroMockup() {
  return (
    <svg
      viewBox="0 0 640 420"
      role="img"
      aria-labelledby="hero-mockup-title"
      className="border-border h-auto w-full rounded-2xl border bg-white"
    >
      <title id="hero-mockup-title">
        A portfolio webpage marked up with Tracemark: a highlighted headline, a
        handwritten note, a red frame around a button, and the toolbar snapped
        to the right edge.
      </title>

      {/* Browser chrome */}
      <circle cx="22" cy="18" r="5" className="fill-brand-red" />
      <circle cx="38" cy="18" r="5" className="fill-brand-yellow" />
      <circle cx="54" cy="18" r="5" className="fill-brand-green" />
      <rect
        x="80"
        y="9"
        width="420"
        height="18"
        rx="9"
        className="fill-secondary-background"
      />
      <text x="96" y="22" fontSize="10" className="fill-muted-foreground">
        miachen.design
      </text>
      <line x1="0" y1="36" x2="640" y2="36" className="stroke-border" />

      {/* The page being critiqued */}
      <g>
        <circle cx="42" cy="62" r="6" className="fill-foreground" />
        <text
          x="56"
          y="66"
          fontSize="11"
          fontWeight="600"
          className="font-secondary fill-foreground"
        >
          Mia Chen
        </text>
        {[440, 482, 524].map((linkX) => (
          <rect
            key={linkX}
            x={linkX}
            y="59"
            width="32"
            height="6"
            rx="3"
            className="fill-border"
          />
        ))}

        <path
          d="M146 152 L323 150"
          strokeWidth="18"
          opacity="0.6"
          {...drawnStroke({
            delayMs: 300,
            durationMs: 500,
            className: "stroke-brand-yellow mix-blend-multiply",
          })}
        />
        <text
          fontSize="28"
          fontWeight="600"
          className="font-secondary fill-foreground"
        >
          <tspan x="36" y="128">
            Hi, I&apos;m Mia.
          </tspan>
          <tspan x="36" y="160">
            I design calm interfaces.
          </tspan>
        </text>

        {[300, 280, 200].map((lineWidth, lineIndex) => (
          <rect
            key={lineIndex}
            x="36"
            y={184 + lineIndex * 12}
            width={lineWidth}
            height="6"
            rx="3"
            className="fill-border"
          />
        ))}

        <rect
          x="36"
          y="228"
          width="96"
          height="28"
          rx="14"
          className="fill-foreground"
        />
        <text
          x="84"
          y="246"
          fontSize="11"
          textAnchor="middle"
          className="font-secondary fill-white"
        >
          View work
        </text>

        {[36, 300].map((cardX) => (
          <g key={cardX}>
            <rect
              x={cardX}
              y="288"
              width="250"
              height="104"
              rx="10"
              className="fill-secondary-background"
            />
            <circle cx={cardX + 150} cy="320" r="7" className="fill-border" />
            <path
              d={`M${cardX + 92} 364 l22 -26 l14 16 l10 -10 l20 20 Z`}
              className="fill-border"
            />
          </g>
        ))}
      </g>

      {/* Annotations, in the order they draw in */}
      <g className={caveat.className}>
        <text
          x="404"
          y="104"
          fontSize="26"
          transform="rotate(-6 404 104)"
          {...writtenText({
            delayMs: 900,
            durationMs: 600,
            className: "fill-brand-blue",
          })}
        >
          I like this!
        </text>
        <path
          d="M452 114 C 466 136, 430 154, 352 155"
          strokeWidth="2.5"
          {...drawnStroke({
            delayMs: ARROW_SHAFT_DELAY_MS,
            durationMs: ARROW_SHAFT_DURATION_MS,
            className: "stroke-brand-blue",
          })}
        />
        <path
          d="M362 147 L352 155 L363 161"
          strokeWidth="2.5"
          {...drawnStroke({
            delayMs: ARROW_SHAFT_DELAY_MS + ARROW_SHAFT_DURATION_MS,
            durationMs: 200,
            className: "stroke-brand-blue",
          })}
        />

        {/* Dragged out from its top-left corner with the Frame tool */}
        <rect
          x="29"
          y="219"
          width="113"
          height="46"
          rx={FRAME_CORNER_RADIUS}
          fill="none"
          strokeWidth={FRAME_STROKE_WIDTH}
          className="stroke-brand-red animate-frame motion-reduce:animate-none"
          style={{ animationDelay: "2400ms" }}
        />
        <text
          x="152"
          y="254"
          fontSize="22"
          transform="rotate(-3 152 254)"
          {...writtenText({
            delayMs: 3150,
            durationMs: 750,
            className: "fill-brand-red",
          })}
        >
          make it bigger?
        </text>

        <path
          d="M522 298 L534 312 L560 282"
          strokeWidth="3.5"
          {...drawnStroke({
            delayMs: 4000,
            durationMs: 350,
            className: "stroke-brand-green",
          })}
        />
      </g>

      {/* Toolbar, snapped to the right edge. Pencil and green drew the last mark. */}
      <ToolbarMockup
        activeTool="Pencil"
        colorClassName="fill-brand-green"
        transform={`translate(${TOOLBAR_X} ${TOOLBAR_Y}) scale(${EXTENSION_SCALE})`}
      />
    </svg>
  );
}
