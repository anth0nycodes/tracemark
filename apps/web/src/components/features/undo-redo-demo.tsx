import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  hiddenBetween,
} from "@/lib/motion-sequence";
import {
  DemoCanvas,
  MARK_STROKE_WIDTH,
  NARROW_DEMO_WIDTH,
  PageHeading,
  PageImage,
  PageParagraph,
} from "./demo-canvas";
import { ShortcutHint } from "./shortcut-hint";

const UNDO_KEYS_AT_MS = 2200;
const REDO_KEYS_AT_MS = 3400;
// The mark changes a beat after its keys appear, as if they were just pressed.
// Undo and redo are instant in the extension, so there's no transition.
const KEY_PRESS_DELAY_MS = 150;

export function UndoRedoDemo() {
  return (
    <>
      <DemoCanvas width={NARROW_DEMO_WIDTH}>
        <PageHeading
          x={48}
          baselineY={60}
          fontSize={20}
          lines={["Notes on spacing"]}
        />
        <PageParagraph
          x={48}
          baselineY={81}
          lineHeight={14}
          fontSize={11.5}
          lines={[
            "Good spacing is mostly rhythm. Pick a base unit,",
            "use it everywhere, and let whitespace group",
            "related things for you.",
          ]}
        />
        {/* stocksnap.io/photo/minimal-office-CZWGWFXJYB */}
        <PageImage
          id="undo-redo-photo"
          src="/stock/minimal-desk.jpg"
          x={48}
          y={124}
          width={304}
          height={116}
        />

        {/* First mark: stays */}
        <path
          d="M37 57 C 35 41, 118 31, 194 35 C 213 36.5, 219 48, 211 58 C 201 68, 122 72, 61 68.5 C 43 67, 36 60, 40 51 C 43 45.5, 50 43, 59 42"
          strokeWidth={MARK_STROKE_WIDTH}
          className="stroke-brand-blue"
          {...drawnStrokeProps}
          style={animationStyle(drawIn(300, 700))}
        />
        {/* Second mark, circling the plant: undone, then redone */}
        <path
          d="M219 150 C 237 133, 285 131.5, 298 158 C 307 180, 291 206, 256 210 C 226 213, 204 197, 206.5 175 C 208 160, 216.5 151, 231 145.5"
          strokeWidth={MARK_STROKE_WIDTH}
          className="stroke-brand-red"
          {...drawnStrokeProps}
          style={animationStyle(
            drawIn(1200, 700),
            hiddenBetween(
              UNDO_KEYS_AT_MS + KEY_PRESS_DELAY_MS,
              REDO_KEYS_AT_MS + KEY_PRESS_DELAY_MS
            )
          )}
        />
      </DemoCanvas>

      <ShortcutHint
        macKeys={["⌘", "Z"]}
        otherKeys={["Ctrl", "Z"]}
        delayMs={UNDO_KEYS_AT_MS}
      />
      <ShortcutHint
        macKeys={["⌘", "⇧", "Z"]}
        otherKeys={["Ctrl", "Y"]}
        delayMs={REDO_KEYS_AT_MS}
      />
    </>
  );
}
