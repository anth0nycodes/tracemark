import { useMemo, useState, type ReactNode } from "react";
import { HighlighterPopoverContext } from "./constants";

export function HighlighterPopoverProvider({ children }: { children: ReactNode }) {
  const [highlighterWidth, setHighlighterWidth] = useState(20);
  const value = useMemo(() => ({ highlighterWidth, setHighlighterWidth }), [highlighterWidth]);

  return (
    <HighlighterPopoverContext.Provider value={value}>
      {children}
    </HighlighterPopoverContext.Provider>
  );
}
