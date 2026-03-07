import { useContext } from "react";
import { EraserPopoverContext } from "./constants";

export function useEraserPopover() {
  const context = useContext(EraserPopoverContext);

  if (!context) {
    throw new Error(
      "useEraserPopover must be used within a EraserPopoverProvider"
    );
  }

  return context;
}
