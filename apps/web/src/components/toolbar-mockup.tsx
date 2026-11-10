import type { SVGProps } from "react";
import {
  Copy,
  Download,
  Eraser,
  GripHorizontal,
  Hand,
  Highlighter,
  MousePointer2,
  PencilLine,
  Square,
  Sun,
  Trash2,
  X,
} from "lucide-react";

/*
 * An SVG drawing of the extension's toolbar (apps/extension/src/components/
 * toolbar.tsx), snapped to a vertical edge. All sizes are the real toolbar's
 * CSS pixels. Scale the group with a transform to fit it into a mockup.
 */

const BUTTON_SIZE = 36;
const ICON_SIZE = 16;
const GAP = 4;
const PADDING = 6;
const BORDER_WIDTH = 2;
const DIVIDER_LENGTH = 28;
const DIVIDER_THICKNESS = 2;
// 36px buttons + 2 × 6px padding + 2 × 2px border, same as the extension
export const TOOLBAR_THICKNESS = BUTTON_SIZE + PADDING * 2 + BORDER_WIDTH * 2;

// Copies of the extension's custom icons (components/custom-icons/icons.tsx)
function LineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className="fill-foreground"
        d="M19 5 a.5.5 0 0 1 0 .708 l-14 14 a.5.5 0 0 1-.708-.708 l14-14 a.5.5 0 0 1 .708 0"
      />
    </svg>
  );
}

function TextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.33337 16.6667H5.83337" />
      <path d="M11.6666 16.6667H17.5" />
      <path d="M5.75 12.5H11.5" />
      <path d="M8.5 5.25L13.3333 16.6667" />
      <path d="M4.16663 16.6666L9.16663 3.33325H10.8333L16.6666 16.6666" />
    </svg>
  );
}

type ToolbarIcon = (props: SVGProps<SVGSVGElement>) => React.ReactNode;

type ToolbarSlot =
  | { kind: "handle" }
  | { kind: "color" }
  | { kind: "divider" }
  | {
      kind: "button";
      name: string;
      icon: ToolbarIcon;
      shortcut?: string;
      isDestructive?: boolean;
    };

// Same order as the extension: handle, color, tools, actions, close
const TOOLBAR_SLOTS: ToolbarSlot[] = [
  { kind: "handle" },
  { kind: "color" },
  { kind: "divider" },
  { kind: "button", name: "Interact", icon: Hand, shortcut: "I" },
  { kind: "button", name: "Select", icon: MousePointer2, shortcut: "V" },
  { kind: "button", name: "Pencil", icon: PencilLine, shortcut: "P" },
  { kind: "button", name: "Highlighter", icon: Highlighter, shortcut: "H" },
  { kind: "button", name: "Erase", icon: Eraser, shortcut: "E" },
  { kind: "button", name: "Text", icon: TextIcon, shortcut: "T" },
  { kind: "button", name: "Frame", icon: Square, shortcut: "F" },
  { kind: "button", name: "Line", icon: LineIcon, shortcut: "L" },
  { kind: "divider" },
  { kind: "button", name: "Copy", icon: Copy, shortcut: "⇧C" },
  { kind: "button", name: "Export", icon: Download },
  { kind: "button", name: "Clear", icon: Trash2, isDestructive: true },
  { kind: "button", name: "Theme", icon: Sun },
  { kind: "divider" },
  { kind: "button", name: "Close", icon: X },
];

function getSlotLength(slot: ToolbarSlot) {
  return slot.kind === "divider" ? DIVIDER_THICKNESS : BUTTON_SIZE;
}

// Top edge of each slot, stacked with the toolbar's gap between them
const SLOT_OFFSETS = TOOLBAR_SLOTS.reduce<number[]>((offsets, slot, index) => {
  const previousEnd =
    index === 0
      ? BORDER_WIDTH + PADDING
      : offsets[index - 1] + getSlotLength(TOOLBAR_SLOTS[index - 1]) + GAP;
  return [...offsets, previousEnd];
}, []);

export const TOOLBAR_LENGTH =
  SLOT_OFFSETS[SLOT_OFFSETS.length - 1] +
  getSlotLength(TOOLBAR_SLOTS[TOOLBAR_SLOTS.length - 1]) +
  PADDING +
  BORDER_WIDTH;

const CONTENT_X = BORDER_WIDTH + PADDING;
const CENTER_X = TOOLBAR_THICKNESS / 2;

/*
 * SVG has no conic gradient, so the color ring is built from thin arcs. The
 * extension's ring is conic-gradient(red, yellow, lime, aqua, blue, magenta,
 * red), which is hue = angle clockwise from 12 o'clock.
 */
const RING_SEGMENT_COUNT = 60;
const RING_RADIUS = 12.5; // 28px ring (36px slot minus 4px padding), 3px thick
const RING_THICKNESS = 3;

function describeRingSegment(centerY: number, segmentIndex: number) {
  const degreesPerSegment = 360 / RING_SEGMENT_COUNT;
  // Overlap neighbors slightly so no hairline seams show between arcs
  const startAngle = ((segmentIndex * degreesPerSegment - 90) * Math.PI) / 180;
  const endAngle =
    (((segmentIndex + 1.15) * degreesPerSegment - 90) * Math.PI) / 180;
  const startX = CENTER_X + RING_RADIUS * Math.cos(startAngle);
  const startY = centerY + RING_RADIUS * Math.sin(startAngle);
  const endX = CENTER_X + RING_RADIUS * Math.cos(endAngle);
  const endY = centerY + RING_RADIUS * Math.sin(endAngle);
  return `M${startX.toFixed(2)} ${startY.toFixed(2)} A${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

type ToolbarMockupProps = {
  activeTool: string;
  // A design-system fill class for the color swatch, e.g. "fill-brand-green"
  colorClassName: string;
  transform?: string;
};

export function ToolbarMockup({
  activeTool,
  colorClassName,
  transform,
}: ToolbarMockupProps) {
  return (
    <g transform={transform} aria-hidden>
      <defs>
        <filter
          id="toolbar-mockup-shadow"
          x="-50%"
          y="-10%"
          width="200%"
          height="120%"
        >
          {/* Tailwind's shadow-md, as the extension uses */}
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.1"
          />
        </filter>
      </defs>

      <rect
        x={BORDER_WIDTH / 2}
        y={BORDER_WIDTH / 2}
        width={TOOLBAR_THICKNESS - BORDER_WIDTH}
        height={TOOLBAR_LENGTH - BORDER_WIDTH}
        rx={(TOOLBAR_THICKNESS - BORDER_WIDTH) / 2}
        strokeWidth={BORDER_WIDTH}
        filter="url(#toolbar-mockup-shadow)"
        className="stroke-border fill-white"
      />

      {TOOLBAR_SLOTS.map((slot, slotIndex) => {
        const slotY = SLOT_OFFSETS[slotIndex];
        const iconX = CONTENT_X + (BUTTON_SIZE - ICON_SIZE) / 2;
        const iconY = slotY + (BUTTON_SIZE - ICON_SIZE) / 2;

        if (slot.kind === "divider") {
          return (
            <rect
              key={slotIndex}
              x={CENTER_X - DIVIDER_LENGTH / 2}
              y={slotY}
              width={DIVIDER_LENGTH}
              height={DIVIDER_THICKNESS}
              rx={DIVIDER_THICKNESS / 2}
              // Matches the extension's muted divider (#C2C7CB)
              opacity="0.4"
              className="fill-muted-foreground"
            />
          );
        }

        if (slot.kind === "handle") {
          return (
            <GripHorizontal
              key={slotIndex}
              x={iconX}
              y={iconY}
              width={ICON_SIZE}
              height={ICON_SIZE}
              className="text-muted-foreground"
            />
          );
        }

        if (slot.kind === "color") {
          const centerY = slotY + BUTTON_SIZE / 2;
          return (
            <g key={slotIndex}>
              {Array.from({ length: RING_SEGMENT_COUNT }, (_, segmentIndex) => (
                <path
                  key={segmentIndex}
                  d={describeRingSegment(centerY, segmentIndex)}
                  fill="none"
                  strokeWidth={RING_THICKNESS}
                  stroke={`hsl(${(segmentIndex * 360) / RING_SEGMENT_COUNT} 100% 50%)`}
                />
              ))}
              <circle
                cx={CENTER_X}
                cy={centerY}
                r={RING_RADIUS - RING_THICKNESS / 2}
                className={colorClassName}
              />
            </g>
          );
        }

        const isActive = slot.name === activeTool;
        return (
          <g key={slotIndex}>
            {isActive && (
              <rect
                x={CONTENT_X}
                y={slotY}
                width={BUTTON_SIZE}
                height={BUTTON_SIZE}
                rx="10"
                className="fill-secondary-background"
              />
            )}
            <slot.icon
              x={iconX}
              y={iconY}
              width={ICON_SIZE}
              height={ICON_SIZE}
              className={
                slot.isDestructive ? "text-brand-red" : "text-foreground"
              }
            />
            {slot.shortcut && (
              <text
                // The extension pins shortcuts to the button's bottom-right
                x={CONTENT_X + BUTTON_SIZE - 4}
                y={slotY + BUTTON_SIZE - (slot.shortcut === "⇧C" ? 1 : 4)}
                fontSize="9"
                fontWeight="600"
                textAnchor="end"
                opacity="0.6"
                className="fill-muted-foreground"
              >
                {slot.shortcut}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
