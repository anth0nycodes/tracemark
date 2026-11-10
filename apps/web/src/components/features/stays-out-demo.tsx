import { FRAME_CORNER_RADIUS, TOOLBAR_EDGE_GAP } from "@/lib/extension-metrics";
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
  FRAME_MARK_STROKE_WIDTH,
  MARK_STROKE_WIDTH,
  PageButton,
  PageHeading,
  PageImage,
  PageParagraph,
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
        <PageParagraph
          x={56}
          baselineY={128}
          lineHeight={15}
          fontSize={12}
          lines={[
            "Cabins, lake houses and small inns a few hours from the city,",
            "hand-picked for slow mornings and long walks in the woods.",
            "Book a weekend away in a few minutes,",
            "then leave the laptop at home and switch off.",
          ]}
        />
        <PageButton x={56} y={196} width={96} height={28} label="Explore" />
        {/* stocksnap.io/photo/wood-logs-HJAYJG4OLY */}
        <PageImage
          id="stays-out-photo"
          src="/stock/cabin.jpg"
          x={430}
          y={44}
          width={220}
          height={170}
        />

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
            d="M56 106 C 59.5 101.9, 64.1 101.3, 67.6 105.3 C 71.3 109.3, 76.3 109.3, 80.0 105.4 C 83.5 101.5, 88.3 101.6, 91.9 105.6 C 95.6 108.9, 100.6 109.2, 104.3 105.9 C 107.7 102.2, 112.3 102.6, 115.8 106.3 C 118.9 109.8, 123.0 109.0, 126.1 105.5 C 129.2 102.0, 133.3 101.9, 136.4 105.4 C 139.6 109.3, 143.8 109.5, 147.0 105.6 C 150.2 102.7, 154.5 103.5, 157.8 106.3 C 160.7 109.4, 164.6 109.4, 167.6 106.3 C 170.8 102.8, 175.1 102.6, 178.4 106.2 C 181.7 109.5, 186.1 108.9, 189.4 105.5 C 192.4 102.4, 196.3 102.6, 199.3 105.6 C 202.4 109.7, 206.6 109.6, 209.8 105.6 C 211.6 102.4, 214.1 102.3, 216.0 105.5"
            fill="none"
            strokeWidth={MARK_STROKE_WIDTH}
            strokeLinecap="round"
            className="stroke-brand-red"
          />
          <path
            d="M62 139.4 C 125 137.6, 210 140.6, 276 138.6 C 312 137.6, 338 139.2, 355 138.2"
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
            strokeWidth={FRAME_MARK_STROKE_WIDTH}
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
