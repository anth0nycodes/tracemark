import { useState, type ReactNode } from "react";
import { ColorContext } from "./constants";

export function ColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#000000");

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}
