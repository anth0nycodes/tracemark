import { useMemo, useState, type ReactNode } from "react";
import { FramePopoverContext, type Frame } from "./constants";

export function FramePopoverProvider({ children }: { children: ReactNode }) {
  const [frame, setFrame] = useState<Frame>("Rect");
  const value = useMemo(() => ({ frame, setFrame }), [frame]);
  return (
    <FramePopoverContext.Provider value={value}>
      {children}
    </FramePopoverContext.Provider>
  );
}
