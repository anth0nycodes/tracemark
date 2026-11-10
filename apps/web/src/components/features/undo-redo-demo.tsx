import {
  animationStyle,
  drawIn,
  drawnStrokeProps,
  hiddenBetween,
} from "@/lib/motion-sequence";
import {
  DemoCanvas,
  ImagePlaceholder,
  NARROW_DEMO_WIDTH,
  PageHeading,
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
        {[280, 250, 180].map((lineWidth, lineIndex) => (
          <rect
            key={lineIndex}
            x="48"
            y={74 + lineIndex * 14}
            width={lineWidth}
            height="7"
            rx="3.5"
            className="fill-border"
          />
        ))}
        <ImagePlaceholder x={48} y={124} width={304} height={116} />

        {/* First mark: stays */}
        <path
          d="M40 54 C 42 34, 208 30, 214 50 C 220 70, 62 76, 42 62 C 36 58, 38 50, 50 45"
          strokeWidth="3.5"
          className="stroke-brand-blue"
          {...drawnStrokeProps}
          style={animationStyle(drawIn(300, 700))}
        />
        {/* Second mark: undone, then redone */}
        <path
          d="M168 156 C 190 134, 250 140, 252 176 C 254 212, 186 220, 164 196 C 152 182, 156 162, 176 152"
          strokeWidth="3.5"
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
