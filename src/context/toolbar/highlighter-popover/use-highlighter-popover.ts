import { useContext } from "react";
import { HighlighterPopoverContext } from "./constants";

export function useHighlighterPopover() {
  const context = useContext(HighlighterPopoverContext);

  if (!context) {
    throw new Error(
      "useHighlighterPopover must be used within a HighlighterPopoverProvider"
    );
  }

  return context;
}
