import type { ReactNode } from "react";

/*
 * Shared frame for the feature demos. Every demo is 320 units tall, so wide
 * and narrow cards scale by the same amount when their visuals share a
 * height. The widths roughly match the cards' visual slots on desktop, so
 * little is letterboxed. A white page fills the canvas with a 16-unit margin.
 */
export const DEMO_HEIGHT = 320;
export const WIDE_DEMO_WIDTH = 760;
export const NARROW_DEMO_WIDTH = 400;
export const DEMO_PAGE_INSET = 16;
export const DEMO_PAGE_BOTTOM = DEMO_HEIGHT - DEMO_PAGE_INSET;

// Annotation sizes for the demos. Deliberately bolder than the extension's
// real strokes scaled down: the marks are the product, so they should read
// at a glance even at the demos' small size.
export const MARK_STROKE_WIDTH = 5.5;
export const FRAME_MARK_STROKE_WIDTH = 4.5;

// For groups animated with scale: scale around their own center
export const SCALE_FROM_CENTER = "origin-center [transform-box:fill-box]";

type DemoCanvasProps = {
  width: number;
  children: ReactNode;
};

export function DemoCanvas({ width, children }: DemoCanvasProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${DEMO_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className="size-full"
    >
      <rect
        x={DEMO_PAGE_INSET}
        y={DEMO_PAGE_INSET}
        width={width - DEMO_PAGE_INSET * 2}
        height={DEMO_HEIGHT - DEMO_PAGE_INSET * 2}
        rx="12"
        className="stroke-border fill-white"
      />
      {children}
    </svg>
  );
}

/*
 * A photo on a mock page, cropped to fill its box with rounded corners. The
 * grey block behind it shows until the photo loads. `id` must be unique on
 * the page: it names the clip shape for the corners.
 *
 * Photos are CC0 stock from StockSnap, saved in public/stock and cropped to
 * each box's shape (sources listed where they're used).
 */
export function PageImage({
  id,
  src,
  x,
  y,
  width,
  height,
  cornerRadius = 8,
}: {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius?: number;
}) {
  const clipId = `${id}-clip`;
  return (
    <g>
      <clipPath id={clipId}>
        <rect x={x} y={y} width={width} height={height} rx={cornerRadius} />
      </clipPath>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={cornerRadius}
        className="fill-secondary-background"
      />
      <image
        href={src}
        x={x}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}

// A page heading in the display font. `baselineY` is the first line's baseline.
export function PageHeading({
  x,
  baselineY,
  lines,
  fontSize,
}: {
  x: number;
  baselineY: number;
  lines: string[];
  fontSize: number;
}) {
  return (
    <text
      fontSize={fontSize}
      fontWeight="600"
      className="font-secondary fill-foreground"
    >
      {lines.map((line, lineIndex) => (
        <tspan key={line} x={x} y={baselineY + lineIndex * fontSize * 1.1}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// A dark pill button with its label centered
export function PageButton({
  x,
  y,
  width,
  height,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        className="fill-foreground"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
        className="font-secondary fill-white"
      >
        {label}
      </text>
    </g>
  );
}

// Body copy for a mock page: grey text, one tspan per line. Lines are
// broken by hand so each one's length is predictable for annotations.
export function PageParagraph({
  x,
  baselineY,
  lineHeight,
  fontSize,
  lines,
}: {
  x: number;
  baselineY: number;
  lineHeight: number;
  fontSize: number;
  lines: string[];
}) {
  return (
    <text fontSize={fontSize} className="fill-muted-foreground">
      {lines.map((line, lineIndex) => (
        <tspan key={line} x={x} y={baselineY + lineIndex * lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
