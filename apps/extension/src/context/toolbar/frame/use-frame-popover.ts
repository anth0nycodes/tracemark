import { useContext } from "react";
import { FramePopoverContext } from "./constants";

export function useFramePopover() {
  const context = useContext(FramePopoverContext);

  if (!context) {
    throw new Error(
      "useFramePopover must be used within a FramePopoverProvider"
    );
  }

  return context;
}
