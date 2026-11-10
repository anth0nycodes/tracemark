import type { CSSProperties } from "react";

/*
 * Builders for the timed animations in the hero mockup and feature demos.
 * Each returns one entry of a CSS `animation` list. Combine them on an
 * element with `animationStyle(...)`. Keyframes live in globals.css.
 *
 * All times are milliseconds from when the sequence starts playing.
 */

// A pen eases in and out a little. Steeper curves make short strokes flash in.
const PEN_EASE = "cubic-bezier(0.37, 0, 0.63, 1)";
// Moves fast and settles into place, like the end of a drag.
const SETTLE_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
// For objects travelling across the scene.
const MOVE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
// Overshoots a little before settling, for characters popping into view.
export const POP_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
// Content entering the page: quick start, long gentle settle.
const ENTER_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Gap between staggered items in a section's entrance
export const REVEAL_STAGGER_MS = 80;
// Where a section's entrance starts after its header (title, then intro)
export const SECTION_CONTENT_DELAY_MS = REVEAL_STAGGER_MS * 2;

// PlayOnView trigger for whole page sections, which can be taller than the
// screen: plays once the section's top passes 85% of the viewport.
export const SECTION_TRIGGER = {
  threshold: 0,
  rootMargin: "0px 0px -15% 0px",
};

export const KEY_HINT_DURATION_MS = 800;

export function animationStyle(...animations: string[]): CSSProperties {
  return { animation: animations.join(", ") };
}

// Props for a path that draws itself in with `drawIn`
export const drawnStrokeProps = {
  pathLength: 1,
  strokeDasharray: 1,
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function drawIn(delayMs: number, durationMs: number) {
  return `draw ${durationMs}ms ${PEN_EASE} ${delayMs}ms both`;
}

// Handwriting: a steady left-to-right wipe
export function writeIn(delayMs: number, durationMs: number) {
  return `write ${durationMs}ms linear ${delayMs}ms both`;
}

// Typed text: the same wipe in one step per character
export function typeIn(
  delayMs: number,
  durationMs: number,
  characterCount: number
) {
  return `write ${durationMs}ms steps(${characterCount}, end) ${delayMs}ms both`;
}

export function growFrame(delayMs: number, durationMs: number) {
  return `frame ${durationMs}ms ${SETTLE_EASE} ${delayMs}ms both`;
}

// For elements that are hidden at rest: visible only in this window
export function shownBetween(fromMs: number, untilMs: number) {
  return `appear ${untilMs - fromMs}ms linear ${fromMs}ms`;
}

// For elements that are visible at rest: hidden only in this window
export function hiddenBetween(fromMs: number, untilMs: number) {
  return `vanish ${untilMs - fromMs}ms linear ${fromMs}ms`;
}

/*
 * Moves an element from an offset to where it rests. Pair with
 * `travelOffset` for the starting offset. `easing` can overshoot below 0 to
 * make an arc, e.g. a file tossed up before it falls.
 */
export function travelFrom(
  delayMs: number,
  durationMs: number,
  easing = MOVE_EASE
) {
  return `travel ${durationMs}ms ${easing} ${delayMs}ms both`;
}

export function travelOffset(offsetX: number, offsetY: number) {
  return {
    "--travel-x": `${offsetX}px`,
    "--travel-y": `${offsetY}px`,
  } as CSSProperties;
}

export function expandY(delayMs: number, durationMs: number) {
  return `expand-y ${durationMs}ms ${SETTLE_EASE} ${delayMs}ms both`;
}

export function shrinkAway(delayMs: number, durationMs: number) {
  return `shrink-away ${durationMs}ms ease-in ${delayMs}ms`;
}

export function popIn(delayMs: number, durationMs: number) {
  return `pop-in ${durationMs}ms ${SETTLE_EASE} ${delayMs}ms both`;
}

export function bump(delayMs: number, durationMs: number) {
  return `bump ${durationMs}ms ease-out ${delayMs}ms`;
}

export function keyHint(delayMs: number) {
  return `key-hint ${KEY_HINT_DURATION_MS}ms ease-out ${delayMs}ms`;
}

// Fades content in while it rises a short way into place
export const REVEAL_DURATION_MS = 600;

export function riseIn(delayMs: number) {
  return `rise-in ${REVEAL_DURATION_MS}ms ${ENTER_EASE} ${delayMs}ms both`;
}
