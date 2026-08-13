import { useMemo, useState, type ReactNode } from "react";
import { TextPopoverContext, type TextAlign } from "./constants";

export function TextPopoverProvider({ children }: { children: ReactNode }) {
  const [textAlignment, setTextAlignment] = useState<TextAlign>("left");
  const value = useMemo(
    () => ({ textAlignment, setTextAlignment }),
    [textAlignment]
  );

  return (
    <TextPopoverContext.Provider value={value}>
      {children}
    </TextPopoverContext.Provider>
  );
}
