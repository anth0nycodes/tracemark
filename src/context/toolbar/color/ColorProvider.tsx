import { useMemo, useState, type ReactNode } from "react";
import { ColorContext } from "./constants";

export function ColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#FF0000");
  const value = useMemo(() => ({ color, setColor }), [color]);

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
}
