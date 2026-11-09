import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { FabricCanvasContext } from "./constants";

interface FabricCanvasProviderProps {
  children: ReactNode;
}

export function FabricCanvasProvider({ children }: FabricCanvasProviderProps) {
  const fcRef = useRef<FabricCanvas | null>(null);
  const setFc = useCallback((fc: FabricCanvas | null) => {
    fcRef.current = fc;
  }, []);
  const value = useMemo(() => ({ fcRef, setFc }), [setFc]);

  return (
    <FabricCanvasContext.Provider value={value}>
      {children}
    </FabricCanvasContext.Provider>
  );
}
