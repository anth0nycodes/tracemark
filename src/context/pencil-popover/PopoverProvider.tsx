import { useState, type ReactNode } from "react";
import { PencilPopoverContext } from "./constants";

export function PencilPopoverProvider({ children }: { children: ReactNode }) {
  const [pencilWidth, setPencilWidth] = useState(5);

  return (
    <PencilPopoverContext.Provider value={{ pencilWidth, setPencilWidth }}>
      {children}
    </PencilPopoverContext.Provider>
  );
}
