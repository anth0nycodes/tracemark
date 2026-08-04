import { useState, type ReactNode } from "react";
import { FramePopoverContext, type Frame } from "./constants";

export function FramePopoverProvider({ children }: { children: ReactNode }) {
  const [frame, setFrame] = useState<Frame>("Rect");
  return (
    <FramePopoverContext.Provider value={{ frame, setFrame }}>
      {children}
    </FramePopoverContext.Provider>
  );
}
