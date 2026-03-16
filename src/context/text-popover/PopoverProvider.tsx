import { useState, type ReactNode } from "react";
import { TextPopoverContext, type TextAlign } from "./constants";

export function TextPopoverProvider({ children }: { children: ReactNode }) {
  const [textAlignment, setTextAlignment] = useState<TextAlign>("left");

  return (
    <TextPopoverContext.Provider value={{ textAlignment, setTextAlignment }}>
      {children}
    </TextPopoverContext.Provider>
  );
}
