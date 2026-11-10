import { Inbox } from "lucide-react";
import {
  FRAME_CORNER_RADIUS,
  FRAME_STROKE_WIDTH,
  TOOLBAR_EDGE_GAP,
} from "@/lib/extension-metrics";
import {
  animationStyle,
  bump,
  hiddenBetween,
  popIn,
  shownBetween,
  shrinkAway,
  travelFrom,
  travelOffset,
} from "@/lib/motion-sequence";
import {
  getToolbarButtonOrigin,
  getToolbarSize,
  TOOLBAR_ACTIVE_RADIUS,
  TOOLBAR_BUTTON_SIZE,
  ToolbarMockup,
} from "../toolbar-mockup";
import {
  DEMO_HEIGHT,
  DEMO_PAGE_INSET,
  DemoCanvas,
  ImagePlaceholder,
  NARROW_DEMO_WIDTH,
  PageHeading,
  SCALE_FROM_CENTER,
} from "./demo-canvas";

const EXTENSION_SCALE = 0.5;
const TOOLBAR_SIZE = getToolbarSize("horizontal");
// Snapped to the top edge, leaving the bottom-left corner for the tray
const TOOLBAR_X =
  (NARROW_DEMO_WIDTH - TOOLBAR_SIZE.width * EXTENSION_SCALE) / 2;
const TOOLBAR_Y = DEMO_PAGE_INSET + TOOLBAR_EDGE_GAP * EXTENSION_SCALE;
const EXPORT_BUTTON = getToolbarButtonOrigin("Export", "horizontal");

const PAGE_CENTER = { x: 200, y: 160 };
const TRAY_CENTER = { x: 60, y: 272 };

const EXPORT_PRESS_MS = 400;
const PAGE_SHRINKS_AT_MS = 750;
const FILE_APPEARS_AT_MS = 1050;
const FILE_FLIGHT_MS = 650;
const FILE_LANDS_AT_MS = FILE_APPEARS_AT_MS + 50 + FILE_FLIGHT_MS;

/*
 * The file's flight is two moves on nested groups: across at a steady speed,
 * and down with a curve whose start dips below 0. That dip lifts the file up
 * before it falls, so together they trace a toss into the tray.
 */
const TOSS_EASE = "cubic-bezier(0.4, -0.7, 0.85, 0.6)";

export function ExportDemo() {
  return (
    <DemoCanvas width={NARROW_DEMO_WIDTH}>
      {/* Annotated page */}
      <PageHeading
        x={48}
        baselineY={92}
        fontSize={20}
        lines={["Weekend ramen"]}
      />
      {[240, 190].map((lineWidth, lineIndex) => (
        <rect
          key={lineIndex}
          x="48"
          y={104 + lineIndex * 14}
          width={lineWidth}
          height="7"
          rx="3.5"
          className="fill-border"
        />
      ))}
      <ImagePlaceholder x={48} y={140} width={304} height={100} />
      <rect
        x="40"
        y="72"
        width="163"
        height="28"
        rx={FRAME_CORNER_RADIUS * EXTENSION_SCALE}
        fill="none"
        strokeWidth={FRAME_STROKE_WIDTH * EXTENSION_SCALE}
        className="stroke-brand-red"
      />
      <path
        d="M296 162 L306 174 L330 148"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand-green"
      />

      {/* A copy of the page shrinks away as the export starts */}
      <g
        className={SCALE_FROM_CENTER}
        style={{
          opacity: 0,
          ...animationStyle(shrinkAway(PAGE_SHRINKS_AT_MS, 300)),
        }}
      >
        <rect
          x={DEMO_PAGE_INSET}
          y={DEMO_PAGE_INSET}
          width={NARROW_DEMO_WIDTH - DEMO_PAGE_INSET * 2}
          height={DEMO_HEIGHT - DEMO_PAGE_INSET * 2}
          rx="12"
          strokeWidth="2"
          className="stroke-foreground fill-white"
        />
        <PageHeading
          x={48}
          baselineY={92}
          fontSize={20}
          lines={["Weekend ramen"]}
        />
        <ImagePlaceholder x={48} y={140} width={304} height={100} />
      </g>

      <ToolbarMockup
        id="export-toolbar"
        orientation="horizontal"
        activeTool="Pencil"
        transform={`translate(${TOOLBAR_X} ${TOOLBAR_Y}) scale(${EXTENSION_SCALE})`}
      >
        {/* Export button pressed */}
        <rect
          x={EXPORT_BUTTON.x}
          y={EXPORT_BUTTON.y}
          width={TOOLBAR_BUTTON_SIZE}
          height={TOOLBAR_BUTTON_SIZE}
          rx={TOOLBAR_ACTIVE_RADIUS}
          className="fill-border"
          style={{
            opacity: 0,
            ...animationStyle(
              shownBetween(EXPORT_PRESS_MS, PAGE_SHRINKS_AT_MS)
            ),
          }}
        />
      </ToolbarMockup>

      {/* Downloads tray, which bumps as the file lands */}
      <g
        className={SCALE_FROM_CENTER}
        style={animationStyle(bump(FILE_LANDS_AT_MS, 250))}
      >
        <rect
          x={TRAY_CENTER.x - 22}
          y={TRAY_CENTER.y - 18}
          width="44"
          height="36"
          rx="10"
          className="stroke-border fill-white"
        />
        <Inbox
          x={TRAY_CENTER.x - 10}
          y={TRAY_CENTER.y - 10}
          width={20}
          height={20}
          className="text-foreground"
        />
      </g>
      <g
        className={SCALE_FROM_CENTER}
        style={animationStyle(
          hiddenBetween(0, FILE_LANDS_AT_MS),
          popIn(FILE_LANDS_AT_MS, 200)
        )}
      >
        <circle
          cx={TRAY_CENTER.x + 20}
          cy={TRAY_CENTER.y - 16}
          r="8"
          className="fill-primary"
        />
        <text
          x={TRAY_CENTER.x + 20}
          y={TRAY_CENTER.y - 12.5}
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
          className="fill-primary-foreground"
        >
          1
        </text>
      </g>

      {/* The PNG, tossed from the page into the tray. It rests in the tray. */}
      <g
        style={{
          ...travelOffset(PAGE_CENTER.x - TRAY_CENTER.x, 0),
          ...animationStyle(
            travelFrom(FILE_APPEARS_AT_MS + 50, FILE_FLIGHT_MS, "linear")
          ),
        }}
      >
        <g
          style={{
            ...travelOffset(0, PAGE_CENTER.y - TRAY_CENTER.y),
            ...animationStyle(
              travelFrom(FILE_APPEARS_AT_MS + 50, FILE_FLIGHT_MS, TOSS_EASE)
            ),
          }}
        >
          <g
            className={SCALE_FROM_CENTER}
            style={{
              opacity: 0,
              ...animationStyle(
                shownBetween(FILE_APPEARS_AT_MS, FILE_LANDS_AT_MS),
                popIn(FILE_APPEARS_AT_MS, 200)
              ),
            }}
          >
            <PngFile center={TRAY_CENTER} />
          </g>
        </g>
      </g>
    </DemoCanvas>
  );
}

function PngFile({ center }: { center: { x: number; y: number } }) {
  const left = center.x - 13;
  const top = center.y - 16;
  return (
    <g>
      <path
        d={`M${left} ${top + 2} a2 2 0 0 1 2 -2 h16 l8 8 v22 a2 2 0 0 1 -2 2 h-22 a2 2 0 0 1 -2 -2 z`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="stroke-foreground fill-white"
      />
      <path
        d={`M${left + 18} ${top} v8 h8`}
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="stroke-foreground"
      />
      <rect
        x={left + 3}
        y={top + 18}
        width="20"
        height="9"
        rx="2"
        className="fill-primary"
      />
      <text
        x={center.x}
        y={top + 25}
        fontSize="6.5"
        fontWeight="700"
        textAnchor="middle"
        className="fill-primary-foreground"
      >
        PNG
      </text>
    </g>
  );
}
