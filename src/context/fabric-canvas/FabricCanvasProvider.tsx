import { useRef, type ReactNode } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { FabricCanvasContext } from "./constants";

interface FabricCanvasProviderProps {
  children: ReactNode;
}

export function FabricCanvasProvider({ children }: FabricCanvasProviderProps) {
  const fcRef = useRef<FabricCanvas | null>(null);
  const setFc = (fc: FabricCanvas | null) => {
    fcRef.current = fc;
  };

  return (
    <FabricCanvasContext.Provider value={{ fcRef, setFc }}>
      {children}
    </FabricCanvasContext.Provider>
  );
}
