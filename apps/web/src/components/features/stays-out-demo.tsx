import {
  FRAME_CORNER_RADIUS,
  FRAME_STROKE_WIDTH,
  TOOLBAR_EDGE_GAP,
} from "@/lib/extension-metrics";
import {
  animationStyle,
  expandY,
  hiddenBetween,
  shownBetween,
  travelFrom,
  travelOffset,
} from "@/lib/motion-sequence";
import {
  CollapsedToolbarMockup,
  getToolbarHandleCenter,
  getToolbarSize,
  TOOLBAR_THICKNESS,
  ToolbarMockup,
} from "../toolbar-mockup";
import {
  DEMO_HEIGHT,
  DEMO_PAGE_BOTTOM,
  DEMO_PAGE_INSET,
  DemoCanvas,
  ImagePlaceholder,
  PageButton,
  PageHeading,
  SCALE_FROM_CENTER,
  WIDE_DEMO_WIDTH,
} from "./demo-canvas";
import { ShortcutHint } from "./shortcut-hint";

const EXTENSION_SCALE = 0.43;
const EDGE_GAP = TOOLBAR_EDGE_GAP * EXTENSION_SCALE;

// Starts snapped to the bottom edge, centered
const HORIZONTAL_SIZE = getToolbarSize("horizontal");
const BOTTOM_BAR = {
  x: (WIDE_DEMO_WIDTH - HORIZONTAL_SIZE.width * EXTENSION_SCALE) / 2,
  y: DEMO_PAGE_BOTTOM - EDGE_GAP - HORIZONTAL_SIZE.height * EXTENSION_SCALE,
};
// Ends snapped to the right edge, centered
const VERTICAL_SIZE = getToolbarSize("vertical");
const RIGHT_BAR = {
  x:
    WIDE_DEMO_WIDTH -
    DEMO_PAGE_INSET -
    EDGE_GAP -
    VERTICAL_SIZE.width * EXTENSION_SCALE,
  y: (DEMO_HEIGHT - VERTICAL_SIZE.height * EXTENSION_SCALE) / 2,
};

// The drag starts on the bottom bar's handle and drops at the right edge
const handleInBar = getToolbarHandleCenter("horizontal");
const GRAB_POINT = {
  x: BOTTOM_BAR.x + handleInBar.x * EXTENSION_SCALE,
  y: BOTTOM_BAR.y + handleInBar.y * EXTENSION_SCALE,
};
const DROP_POINT = {
  x: RIGHT_BAR.x + (TOOLBAR_THICKNESS / 2) * EXTENSION_SCALE,
  y: DEMO_HEIGHT / 2,
};
const DRAG_OFFSET = {
  x: GRAB_POINT.x - DROP_POINT.x,
  y: GRAB_POINT.y - DROP_POINT.y,
};

const CURSOR_APPEARS_AT_MS = 100;
const GRABBED_AT_MS = 600;
const DROPPED_AT_MS = 1300;
const CURSOR_LEAVES_AT_MS = 1500;
const HIDE_KEYS_AT_MS = 2000;
const SHOW_KEYS_AT_MS = 3200;
// The overlay changes a beat after its keys appear, as if they were just
// pressed. Hiding is instant in the extension.
const KEY_PRESS_DELAY_MS = 150;

export function StaysOutDemo() {
  return (
    <>
      <DemoCanvas width={WIDE_DEMO_WIDTH}>
        {/* Page */}
        <PageHeading
          x={56}
          baselineY={66}
          fontSize={24}
          lines={["Find your next", "quiet getaway."]}
        />
        {[340, 310, 250, 300].map((lineWidth, lineIndex) => (
          <rect
            key={lineIndex}
            x="56"
            y={120 + lineIndex * 15}
            width={lineWidth}
            height="7"
            rx="3.5"
            className="fill-border"
          />
        ))}
        <PageButton x={56} y={196} width={96} height={28} label="Explore" />
        <ImagePlaceholder x={430} y={44} width={220} height={170} />

        {/* The bar on the bottom edge, until it's grabbed */}
        <g
          style={{
            opacity: 0,
            ...animationStyle(shownBetween(0, GRABBED_AT_MS)),
          }}
        >
          <ToolbarMockup
            id="stays-out-bottom-toolbar"
            orientation="horizontal"
            activeTool="Pencil"
            transform={`translate(${BOTTOM_BAR.x} ${BOTTOM_BAR.y}) scale(${EXTENSION_SCALE})`}
          />
        </g>

        {/* While dragged, the bar is a circle that follows the pointer */}
        <g
          style={{
            opacity: 0,
            ...travelOffset(DRAG_OFFSET.x, DRAG_OFFSET.y),
            ...animationStyle(
              shownBetween(GRABBED_AT_MS, DROPPED_AT_MS),
              travelFrom(GRABBED_AT_MS, DROPPED_AT_MS - GRABBED_AT_MS)
            ),
          }}
        >
          <g
            transform={`translate(${DROP_POINT.x} ${DROP_POINT.y}) scale(${EXTENSION_SCALE})`}
          >
            <CollapsedToolbarMockup id="stays-out-collapsed-toolbar" />
          </g>
        </g>

        {/*
          The overlay: drawings and the toolbar. Hidden and shown with the
          shortcut, and nothing is lost in between.
        */}
        <g
          style={animationStyle(
            hiddenBetween(
              HIDE_KEYS_AT_MS + KEY_PRESS_DELAY_MS,
              SHOW_KEYS_AT_MS + KEY_PRESS_DELAY_MS
            )
          )}
        >
          <path
            d="M56 106 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="stroke-brand-red"
          />
          <path
            d="M64 138.5 L358 138.5"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.6"
            className="stroke-brand-yellow mix-blend-multiply"
          />
          <rect
            x="422"
            y="36"
            width="236"
            height="186"
            rx={FRAME_CORNER_RADIUS * EXTENSION_SCALE}
            fill="none"
            strokeWidth={FRAME_STROKE_WIDTH * EXTENSION_SCALE}
            className="stroke-brand-green"
          />

          {/* Lands on the right edge and expands out of the circle */}
          <g
            className={SCALE_FROM_CENTER}
            style={animationStyle(
              hiddenBetween(0, DROPPED_AT_MS),
              expandY(DROPPED_AT_MS, 250)
            )}
          >
            <ToolbarMockup
              id="stays-out-right-toolbar"
              activeTool="Pencil"
              transform={`translate(${RIGHT_BAR.x} ${RIGHT_BAR.y}) scale(${EXTENSION_SCALE})`}
            />
          </g>
        </g>

        {/* Pointer: moves onto the handle, then drags the circle to the edge */}
        <g
          style={{
            opacity: 0,
            ...travelOffset(DRAG_OFFSET.x, DRAG_OFFSET.y),
            ...animationStyle(
              shownBetween(CURSOR_APPEARS_AT_MS, CURSOR_LEAVES_AT_MS),
              travelFrom(GRABBED_AT_MS, DROPPED_AT_MS - GRABBED_AT_MS)
            ),
          }}
        >
          <g
            style={{
              ...travelOffset(70, -60),
              ...animationStyle(
                travelFrom(
                  CURSOR_APPEARS_AT_MS,
                  GRABBED_AT_MS - 150 - CURSOR_APPEARS_AT_MS
                )
              ),
            }}
          >
            <path
              transform={`translate(${DROP_POINT.x + 2} ${DROP_POINT.y + 2})`}
              d="M0 0 L0 15 L4 11.5 L6.8 17.6 L9.4 16.5 L6.7 10.5 L11.6 10.5 Z"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="fill-foreground stroke-white"
            />
          </g>
        </g>
      </DemoCanvas>

      <ShortcutHint
        macKeys={["⌘", "."]}
        otherKeys={["Ctrl", "."]}
        delayMs={HIDE_KEYS_AT_MS}
      />
      <ShortcutHint
        macKeys={["⌘", "."]}
        otherKeys={["Ctrl", "."]}
        delayMs={SHOW_KEYS_AT_MS}
      />
    </>
  );
}
