import { useContext } from "react";
import { ShadowContainerContext } from "./constants";

export function useShadowContainer() {
  const context = useContext(ShadowContainerContext);

  // Fall back to document.body when no provider is present (e.g., in dev mode)
  return context ?? document.body;
}
