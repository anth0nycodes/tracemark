import type { SVGProps } from "react";
import { TracemarkWordmark, WORDMARK_ASPECT_RATIO } from "./wordmark";

// Copied from TracemarkLogo in apps/web/src/components/svgs/logo-mark.tsx. Keep the two in sync.
//
// The mark (a pointer that has just drawn a red marker stroke) beside the
// wordmark, as one SVG so they always scale together. Drawn in a 40-unit-tall
// box. Unlike the landing page, the pointer's outline uses the background
// color instead of white, so it still separates pointer and stroke in dark mode.

const MARKER_STROKE_PATH = "M5 32.5 C 11 32, 12 23, 18.6 19.2";
const MARKER_STROKE_WIDTH = 7.5;
const POINTER_PATH = "M0 0 L0 17 L4.6 13 L7.6 19.4 L10.6 18.1 L7.7 11.9 L13.2 11.9 Z";
const POINTER_TIP = { x: 17.8, y: 10 };
const POINTER_TILT = -20;
const POINTER_SCALE = 1.2;

const WORDMARK_HEIGHT = 24.4;
const WORDMARK_X = 44;
const WORDMARK_WIDTH = WORDMARK_HEIGHT * WORDMARK_ASPECT_RATIO;

export function TracemarkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 0 ${WORDMARK_X + WORDMARK_WIDTH} 40`} fill="none" {...props}>
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
        strokeWidth="1.1"
        strokeLinejoin="round"
        className="fill-foreground stroke-background"
      />
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
