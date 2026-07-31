import { createContext, type RefObject } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";

interface FabricCanvasContextProps {
  fcRef: RefObject<FabricCanvas | null>;
  setFc: (fc: FabricCanvas | null) => void;
}

export const FabricCanvasContext =
  createContext<FabricCanvasContextProps | null>(null);
