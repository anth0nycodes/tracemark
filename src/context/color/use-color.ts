import { useContext } from "react";
import { ColorContext } from "./constants";

export function useColor() {
  const context = useContext(ColorContext);

  if (context === undefined) {
    throw new Error("useColor must be used within a ColorProvider");
  }

  return context;
}
