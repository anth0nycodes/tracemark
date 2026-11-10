import type { SVGProps } from "react";
import { TracemarkWordmark, WORDMARK_ASPECT_RATIO } from "./wordmark";

/*
 * The Tracemark mark: a pointer that has just drawn a red marker stroke.
 * The stroke is a gentle S, and the pointer is tilted -20° as if it's mid
 * gesture. They touch, separated only by the pointer's white outline, so
 * they read as one motion rather than two items.
 *
 * Drawn in a 40x40 box. Decorative wherever it appears next to the name.
 */

// Ends tucked just under the pointer's left edge, so only the pointer's
// white outline separates them
const MARKER_STROKE_PATH = "M5 32.5 C 11 32, 12 23, 18.6 19.2";
const MARKER_STROKE_WIDTH = 7.5;
// A standard pointer arrow with its tip at (0, 0)
const POINTER_PATH =
  "M0 0 L0 17 L4.6 13 L7.6 19.4 L10.6 18.1 L7.7 11.9 L13.2 11.9 Z";
const POINTER_TIP = { x: 17.8, y: 10 };
const POINTER_TILT = -20;
const POINTER_SCALE = 1.2;

function MarkShapes() {
  return (
    <g>
      <path
        d={MARKER_STROKE_PATH}
        fill="none"
        strokeWidth={MARKER_STROKE_WIDTH}
        strokeLinecap="round"
        className="stroke-brand-red"
      />
      <path
        transform={`translate(${POINTER_TIP.x} ${POINTER_TIP.y}) rotate(${POINTER_TILT}) scale(${POINTER_SCALE})`}
        d={POINTER_PATH}
        // A hairline: enough to separate pointer and stroke where they touch,
        // thin enough that it doesn't read as a gap at navbar size
        strokeWidth="1.1"
        strokeLinejoin="round"
        className="fill-foreground stroke-white"
      />
    </g>
  );
}

export function TracemarkMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <MarkShapes />
    </svg>
  );
}

// The wordmark's letters (ascenders to baseline) are this tall next to the
// 40-unit mark, centered vertically, after a small gap
const WORDMARK_HEIGHT = 24.4;
const WORDMARK_X = 44;
const WORDMARK_WIDTH = WORDMARK_HEIGHT * WORDMARK_ASPECT_RATIO;

// Mark and wordmark as one SVG, so they always scale together
export function TracemarkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${WORDMARK_X + WORDMARK_WIDTH} 40`}
      fill="none"
      {...props}
    >
      <MarkShapes />
      <TracemarkWordmark
        x={WORDMARK_X}
        y={(40 - WORDMARK_HEIGHT) / 2}
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        className="text-foreground"
      />
    </svg>
  );
}

/*
 * The mark on a hand-drawn rounded square, like an app icon. The outline
 * wobbles slightly to match the mascots and stars.
 */
export function TracemarkTile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <path
        d="M9 2.5 C 18 1.5, 26 2, 31 2.8 C 35.5 3.5, 37.5 6, 37.6 10 C 38 18, 37.8 25, 37.2 30.5 C 36.8 35, 34.5 37.3, 30 37.5 C 22 38, 15 37.8, 9.5 37.2 C 5 36.8, 2.6 34.6, 2.5 30 C 2 22, 2.2 15, 2.7 9 C 3 5, 5 3, 9 2.5 Z"
        strokeWidth="1.6"
        className="stroke-foreground fill-white"
      />
      {/*
        The mark's drawing spans about x 1-38 and y 9-36 (center 19.4, 22.6).
        Scale it down and center it in the tile with room to breathe.
      */}
      <g transform="translate(6.8 4.6) scale(0.68)">
        <MarkShapes />
      </g>
    </svg>
  );
}
