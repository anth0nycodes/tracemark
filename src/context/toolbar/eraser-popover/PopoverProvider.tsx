import { useState, type ReactNode } from "react";
import { EraserPopoverContext } from "./constants";

export function EraserPopoverProvider({ children }: { children: ReactNode }) {
  const [eraserWidth, setEraserWidth] = useState(5);

  return (
    <EraserPopoverContext.Provider value={{ eraserWidth, setEraserWidth }}>
      {children}
    </EraserPopoverContext.Provider>
  );
}
