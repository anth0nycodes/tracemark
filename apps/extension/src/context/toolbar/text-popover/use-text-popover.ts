import { useContext } from "react";
import { TextPopoverContext } from "./constants";

export function useTextPopover() {
  const context = useContext(TextPopoverContext);

  if (!context) {
    throw new Error("useTextPopover must be used within a TextPopoverProvider");
  }

  return context;
}
