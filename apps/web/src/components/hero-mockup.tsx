import { FRAME_CORNER_RADIUS, TOOLBAR_EDGE_GAP } from "@/lib/extension-metrics";
import { handwritingFont } from "@/lib/fonts";
import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  growFrame,
  writeIn,
} from "@/lib/motion-sequence";
import { PageImage, PageParagraph } from "./features/demo-canvas";
import {
  TOOLBAR_LENGTH,
  TOOLBAR_THICKNESS,
  ToolbarMockup,
} from "./toolbar-mockup";

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

// Annotations are drawn bolder than the extension's real strokes scaled
// down: they're the product, so they should read at a glance.
const ANNOTATION_STROKE_WIDTH = 4.5;
const FRAME_ANNOTATION_STROKE_WIDTH = 4.5;

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
        {[
          { label: "Work", x: 452 },
          { label: "About", x: 490 },
          { label: "Contact", x: 534 },
        ].map((navLink) => (
          <text
            key={navLink.label}
            x={navLink.x}
            y="66"
            fontSize="10"
            className="fill-muted-foreground"
          >
            {navLink.label}
          </text>
        ))}

        <path
          d="M146 152.6 C 190 150.4, 238 153.4, 279 150.8 C 300 149.6, 314 151.2, 323 149.6"
          strokeWidth="18"
          opacity="0.7"
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

        <PageParagraph
          x={36}
          baselineY={182}
          lineHeight={13}
          fontSize={10.5}
          lines={[
            "I'm a product designer in Toronto, making tools that feel",
            "quiet, fast and kind to the people who use them. Right now",
            "I'm designing at a small studio.",
          ]}
        />

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

        {/*
          Portfolio work: stocksnap.io/photo/design-mockups-P6HXICOTZ5 and
          stocksnap.io/photo/office-work-42H3JH8QI5
        */}
        {[
          { x: 36, src: "/stock/portfolio-wireframes.jpg" },
          { x: 300, src: "/stock/portfolio-laptop.jpg" },
        ].map((portfolioCard) => (
          <PageImage
            key={portfolioCard.x}
            id={`hero-portfolio-${portfolioCard.x}`}
            src={portfolioCard.src}
            x={portfolioCard.x}
            y={288}
            width={250}
            height={104}
            cornerRadius={10}
          />
        ))}
      </g>

      {/* Annotations, in the order they draw in */}
      <g className={handwritingFont.className}>
        <text
          x="404"
          y="104"
          fontSize="32"
          transform="rotate(-6 404 104)"
          className="fill-brand-blue"
          style={animationStyle(writeIn(900, 600))}
        >
          I like this!
        </text>
        <path
          d="M467 116.5 C 474.5 127.5, 470.5 141.5, 452 148.5 C 433 155.5, 393 158.5, 352.5 156.2"
          strokeWidth={ANNOTATION_STROKE_WIDTH}
          className="stroke-brand-blue"
          {...drawnStrokeProps}
          style={animationStyle(
            drawIn(ARROW_SHAFT_DELAY_MS, ARROW_SHAFT_DURATION_MS)
          )}
        />
        <path
          d="M367.5 143.5 C 361.5 148.5, 356.5 152.8, 352.5 156.4 C 357.5 159.6, 362.2 162.8, 368.6 167.2"
          strokeWidth={ANNOTATION_STROKE_WIDTH}
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
          strokeWidth={FRAME_ANNOTATION_STROKE_WIDTH}
          className="stroke-brand-red"
          style={animationStyle(growFrame(2400, 500))}
        />
        <text
          x="152"
          y="254"
          fontSize="27"
          transform="rotate(-3 152 254)"
          className="fill-brand-red"
          style={animationStyle(writeIn(3150, 750))}
        >
          make it bigger?
        </text>

        <path
          d="M513 301.5 C 518.5 307, 524 313.5, 530.5 320 C 541 305.5, 552.5 290, 568 276"
          strokeWidth="6"
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
