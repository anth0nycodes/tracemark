"use client";

import { animationStyle, keyHint } from "@/lib/motion-sequence";
import { useIsMac } from "@/lib/use-is-mac";

type ShortcutHintProps = {
  macKeys: string[];
  otherKeys: string[];
  delayMs: number;
};

// Keycaps that pop up at the bottom of a demo, as if the shortcut was pressed
export function ShortcutHint({
  macKeys,
  otherKeys,
  delayMs,
}: ShortcutHintProps) {
  const isMac = useIsMac();
  const keys = isMac ? macKeys : otherKeys;

  return (
    <div
      aria-hidden
      className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 opacity-0"
      style={animationStyle(keyHint(delayMs))}
    >
      {keys.map((key) => (
        <kbd
          key={key}
          className="font-secondary border-border text-foreground inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-b-[3px] bg-white px-2 text-base"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
