import { useContext } from "react";
import { EraserPopoverContext } from "./constants";

export function useEraserPopover() {
  const context = useContext(EraserPopoverContext);

  if (context === null) {
    throw new Error(
      "useEraserPopover must be used within an EraserPopoverProvider"
    );
  }

  return context;
}
