import { useMemo, useState, type ReactNode } from "react";
import { LinePopoverContext, type LineStyle } from "./constants";

export function LinePopoverProvider({ children }: { children: ReactNode }) {
  const [lineStyle, setLineStyle] = useState<LineStyle>("Line");
  const value = useMemo(() => ({ lineStyle, setLineStyle }), [lineStyle]);

  return (
    <LinePopoverContext.Provider value={value}>
      {children}
    </LinePopoverContext.Provider>
  );
}
