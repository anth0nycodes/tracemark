import {
  FRAME_CORNER_RADIUS,
  FRAME_STROKE_WIDTH,
  TOOLBAR_EDGE_GAP,
} from "@/lib/extension-metrics";
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
  ImagePlaceholder,
  PageButton,
  PageHeading,
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
      {[340, 310, 250].map((lineWidth, lineIndex) => (
        <rect
          key={lineIndex}
          x="56"
          y={116 + lineIndex * 15}
          width={lineWidth}
          height="7"
          rx="3.5"
          className="fill-border"
        />
      ))}
      <PageButton x={56} y={170} width={96} height={28} label="Get started" />
      <ImagePlaceholder x={470} y={40} width={236} height={150} />

      {/* Marks, one per tool */}
      <path
        d="M56 100 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0"
        strokeWidth="3.5"
        className="stroke-brand-red"
        {...drawnStrokeProps}
        style={animationStyle(drawIn(400, 700))}
      />
      <path
        d="M64 119.5 L388 119.5"
        strokeWidth="16"
        opacity="0.6"
        className="stroke-brand-yellow mix-blend-multiply"
        {...drawnStrokeProps}
        style={animationStyle(drawIn(1500, 400))}
      />
      <text
        x="172"
        y="190"
        fontSize="18"
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
        strokeWidth={FRAME_STROKE_WIDTH * EXTENSION_SCALE}
        className="stroke-brand-green"
        style={animationStyle(growFrame(3400, 500))}
      />
      <path
        d="M292 184 L454 160"
        strokeWidth="3.5"
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
