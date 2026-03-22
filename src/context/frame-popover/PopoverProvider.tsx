import { useState, type ReactNode } from "react";
import { FramePopoverContext, type FrameShape } from "./constants";

export function FramePopoverProvider({ children }: { children: ReactNode }) {
  const [frameShape, setFrameShape] = useState<FrameShape>("square");

  return (
    <FramePopoverContext.Provider value={{ frameShape, setFrameShape }}>
      {children}
    </FramePopoverContext.Provider>
  );
}
