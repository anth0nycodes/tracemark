import { FRAME_CORNER_RADIUS, TOOLBAR_EDGE_GAP } from "@/lib/extension-metrics";
import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  growFrame,
  hiddenBetween,
  shownBetween,
  typeIn,
} from "@/lib/motion-sequence";
import {
  getToolbarButtonOrigin,
  getToolbarSize,
  TOOLBAR_ACTIVE_RADIUS,
  TOOLBAR_BUTTON_SIZE,
  ToolbarMockup,
} from "../toolbar-mockup";
import {
  DEMO_PAGE_BOTTOM,
  DemoCanvas,
  FRAME_MARK_STROKE_WIDTH,
  MARK_STROKE_WIDTH,
  PageButton,
  PageHeading,
  PageImage,
  PageParagraph,
  WIDE_DEMO_WIDTH,
} from "./demo-canvas";

// Large enough to read the tools, since this card is about them
const EXTENSION_SCALE = 0.72;
const TOOLBAR_SIZE = getToolbarSize("horizontal");
const TOOLBAR_X = (WIDE_DEMO_WIDTH - TOOLBAR_SIZE.width * EXTENSION_SCALE) / 2;
const TOOLBAR_Y =
  DEMO_PAGE_BOTTOM - (TOOLBAR_SIZE.height + TOOLBAR_EDGE_GAP) * EXTENSION_SCALE;

// Each tool becomes active, then draws its mark shortly after
const TOOL_STEPS = [
  { tool: "Pencil", activeFromMs: 0 },
  { tool: "Highlighter", activeFromMs: 1300 },
  { tool: "Text", activeFromMs: 2100 },
  { tool: "Frame", activeFromMs: 3200 },
  { tool: "Line", activeFromMs: 4100 },
];

const TYPED_NOTE = "Add pricing?";

// Shown while its step is active. The last step stays, so it is visible at
// rest and the demo ends (or shows, with reduced motion) on the Line tool.
function activeStepStyle(stepIndex: number) {
  const step = TOOL_STEPS[stepIndex];
  const nextStep = TOOL_STEPS[stepIndex + 1];
  return nextStep
    ? {
        opacity: 0,
        ...animationStyle(
          shownBetween(step.activeFromMs, nextStep.activeFromMs)
        ),
      }
    : animationStyle(hiddenBetween(0, step.activeFromMs));
}

export function MarkupToolsDemo() {
  return (
    <DemoCanvas width={WIDE_DEMO_WIDTH}>
      {/* Page */}
      <PageHeading
        x={56}
        baselineY={62}
        fontSize={24}
        lines={["Plan your week", "in five minutes."]}
      />
      <PageParagraph
        x={56}
        baselineY={124}
        lineHeight={15}
        fontSize={12.5}
        lines={[
          "Drag tasks into your week, set a focus block, and let the",
          "planner sort out the rest. Works with your calendar, with",
          "no setup and no learning curve.",
        ]}
      />
      <PageButton x={56} y={170} width={96} height={28} label="Get started" />
      {/* stocksnap.io/photo/lifestyle-office-0DW7NPB8RO */}
      <PageImage
        id="markup-tools-photo"
        src="/stock/planner-desk.jpg"
        x={470}
        y={40}
        width={236}
        height={150}
      />

      {/* Marks, one per tool */}
      <path
        d="M56 100 C 59.0 96.6, 63.0 96.9, 65.9 100.4 C 69.4 104.2, 74.1 103.7, 77.6 99.9 C 81.1 96.4, 85.9 95.9, 89.5 99.4 C 92.7 102.3, 97.1 103.5, 100.3 100.6 C 104.0 97.3, 109.0 96.5, 112.7 99.7 C 116.2 102.8, 120.9 102.6, 124.5 99.5 C 127.5 96.3, 131.5 96.9, 134.5 100.2 C 138.2 103.3, 143.2 103.7, 146.9 100.6 C 150.3 96.6, 154.7 96.4, 158.1 100.4 C 161.1 104.2, 165.1 103.2, 168.1 99.5 C 170.9 96.1, 174.7 97.0, 177.6 100.4 C 180.9 103.5, 185.4 103.5, 188.8 100.5 C 192.5 97.3, 197.4 96.8, 201.0 99.9 C 204.5 104.0, 209.0 103.5, 212.4 99.5 C 213.5 95.3, 214.9 96.0, 216.0 100.2"
        strokeWidth={MARK_STROKE_WIDTH}
        className="stroke-brand-red"
        {...drawnStrokeProps}
        style={animationStyle(drawIn(400, 700))}
      />
      <path
        d="M62 120.6 C 120 118.8, 200 121.4, 262 119.6 C 300 118.6, 326 120.4, 344 119.4"
        strokeWidth="16"
        opacity="0.6"
        className="stroke-brand-yellow mix-blend-multiply"
        {...drawnStrokeProps}
        style={animationStyle(drawIn(1500, 400))}
      />
      <text
        x="172"
        y="190"
        fontSize="21"
        className="font-secondary fill-brand-blue"
        style={animationStyle(typeIn(2300, 700, TYPED_NOTE.length))}
      >
        {TYPED_NOTE}
      </text>
      <rect
        x="462"
        y="32"
        width="252"
        height="166"
        rx={FRAME_CORNER_RADIUS * EXTENSION_SCALE}
        fill="none"
        strokeWidth={FRAME_MARK_STROKE_WIDTH}
        className="stroke-brand-green"
        style={animationStyle(growFrame(3400, 500))}
      />
      <path
        d="M292 184 L454 160"
        strokeWidth={MARK_STROKE_WIDTH}
        className="stroke-brand-red"
        {...drawnStrokeProps}
        style={animationStyle(drawIn(4300, 350))}
      />

      <ToolbarMockup
        id="markup-tools-toolbar"
        orientation="horizontal"
        transform={`translate(${TOOLBAR_X} ${TOOLBAR_Y}) scale(${EXTENSION_SCALE})`}
      >
        {TOOL_STEPS.map((step, stepIndex) => {
          const buttonOrigin = getToolbarButtonOrigin(step.tool, "horizontal");
          return (
            <rect
              key={step.tool}
              x={buttonOrigin.x}
              y={buttonOrigin.y}
              width={TOOLBAR_BUTTON_SIZE}
              height={TOOLBAR_BUTTON_SIZE}
              rx={TOOLBAR_ACTIVE_RADIUS}
              className="fill-secondary-background"
              style={activeStepStyle(stepIndex)}
            />
          );
        })}
      </ToolbarMockup>
    </DemoCanvas>
  );
}
