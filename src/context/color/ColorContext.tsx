import { useState, type ReactNode } from "react";
import { ColorContext } from "./constants";

export function ColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#FF0000");

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}
