import { useMemo, useState, type ReactNode } from "react";
import { EraserPopoverContext } from "./constants";

export function EraserPopoverProvider({ children }: { children: ReactNode }) {
  const [eraserWidth, setEraserWidth] = useState(5);
  const value = useMemo(() => ({ eraserWidth, setEraserWidth }), [eraserWidth]);

  return (
    <EraserPopoverContext.Provider value={value}>
      {children}
    </EraserPopoverContext.Provider>
  );
}
