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

// A placeholder image: a sun and two mountains on a soft block
export function ImagePlaceholder({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const centerX = x + width / 2;
  const baseY = y + height * 0.72;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="8"
        className="fill-secondary-background"
      />
      <circle
        cx={centerX + 12}
        cy={y + height * 0.32}
        r="6"
        className="fill-border"
      />
      <path
        d={`M${centerX - 30} ${baseY} l20 -22 l12 13 l9 -8 l18 17 Z`}
        className="fill-border"
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
