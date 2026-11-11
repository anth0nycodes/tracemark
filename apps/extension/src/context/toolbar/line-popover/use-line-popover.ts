import { useContext } from "react";
import { LinePopoverContext } from "./constants";

export function useLinePopover() {
  const context = useContext(LinePopoverContext);

  if (!context) {
    throw new Error("useLinePopover must be used within a LinePopoverProvider");
  }

  return context;
}
