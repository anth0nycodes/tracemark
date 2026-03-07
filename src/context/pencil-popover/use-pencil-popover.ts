import { useContext } from "react";
import { PencilPopoverContext } from "./constants";

export function usePencilPopover() {
  const context = useContext(PencilPopoverContext);

  if (context === null) {
    throw new Error(
      "usePencilPopover must be used within a PencilPopoverProvider"
    );
  }

  return context;
}
