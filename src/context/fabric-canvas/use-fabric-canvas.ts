import { useContext } from "react";
import { FabricCanvasContext } from "./constants";

export function useFabricCanvas() {
  const context = useContext(FabricCanvasContext);

  if (!context) {
    throw new Error(
      "useFabricCanvas must be used within a FabricCanvasProvider"
    );
  }

  return context;
}
