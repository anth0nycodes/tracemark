import { Caveat } from "next/font/google";
import {
  FRAME_CORNER_RADIUS,
  FRAME_STROKE_WIDTH,
  TOOLBAR_EDGE_GAP,
} from "@/lib/extension-metrics";
import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  growFrame,
  writeIn,
} from "@/lib/motion-sequence";
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
const TOOLBAR_X =
  MOCKUP_WIDTH - (TOOLBAR_THICKNESS + TOOLBAR_EDGE_GAP) * EXTENSION_SCALE;
const TOOLBAR_Y =
  PAGE_TOP + (PAGE_HEIGHT - TOOLBAR_LENGTH * EXTENSION_SCALE) / 2;

// The arrow's head starts the moment its shaft finishes.
const ARROW_SHAFT_DELAY_MS = 1600;
const ARROW_SHAFT_DURATION_MS = 450;

export function HeroMockup() {
  return (
    <svg
      viewBox="0 0 640 420"
      role="img"
      aria-labelledby="hero-mockup-title"
      data-motion-sequence
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
          className="stroke-brand-yellow mix-blend-multiply"
          {...drawnStrokeProps}
          style={animationStyle(drawIn(300, 500))}
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
          className="fill-brand-blue"
          style={animationStyle(writeIn(900, 600))}
        >
          I like this!
        </text>
        <path
          d="M452 114 C 466 136, 430 154, 352 155"
          strokeWidth="2.5"
          className="stroke-brand-blue"
          {...drawnStrokeProps}
          style={animationStyle(
            drawIn(ARROW_SHAFT_DELAY_MS, ARROW_SHAFT_DURATION_MS)
          )}
        />
        <path
          d="M362 147 L352 155 L363 161"
          strokeWidth="2.5"
          className="stroke-brand-blue"
          {...drawnStrokeProps}
          style={animationStyle(
            drawIn(ARROW_SHAFT_DELAY_MS + ARROW_SHAFT_DURATION_MS, 200)
          )}
        />

        {/* Dragged out from its top-left corner with the Frame tool */}
        <rect
          x="29"
          y="219"
          width="113"
          height="46"
          rx={FRAME_CORNER_RADIUS * EXTENSION_SCALE}
          fill="none"
          strokeWidth={FRAME_STROKE_WIDTH * EXTENSION_SCALE}
          className="stroke-brand-red"
          style={animationStyle(growFrame(2400, 500))}
        />
        <text
          x="152"
          y="254"
          fontSize="22"
          transform="rotate(-3 152 254)"
          className="fill-brand-red"
          style={animationStyle(writeIn(3150, 750))}
        >
          make it bigger?
        </text>

        <path
          d="M522 298 L534 312 L560 282"
          strokeWidth="3.5"
          className="stroke-brand-green"
          {...drawnStrokeProps}
          style={animationStyle(drawIn(4000, 350))}
        />
      </g>

      {/* Toolbar, snapped to the right edge. Pencil drew the last mark. */}
      <ToolbarMockup
        id="hero-toolbar"
        activeTool="Pencil"
        transform={`translate(${TOOLBAR_X} ${TOOLBAR_Y}) scale(${EXTENSION_SCALE})`}
      />
    </svg>
  );
}
