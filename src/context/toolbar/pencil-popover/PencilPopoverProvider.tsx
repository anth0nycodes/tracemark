import { useMemo, useState, type ReactNode } from "react";
import { PencilPopoverContext } from "./constants";

export function PencilPopoverProvider({ children }: { children: ReactNode }) {
  const [pencilWidth, setPencilWidth] = useState(5);
  const value = useMemo(() => ({ pencilWidth, setPencilWidth }), [pencilWidth]);

  return (
    <PencilPopoverContext.Provider value={value}>
      {children}
    </PencilPopoverContext.Provider>
  );
}
