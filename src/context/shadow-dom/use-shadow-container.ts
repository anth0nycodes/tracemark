import { useContext } from "react";
import { ShadowContainerContext } from "./constants";

export function useShadowContainer() {
  const context = useContext(ShadowContainerContext);

  if (!context) {
    throw new Error(
      "useShadowContainer must be used within a ShadowContainerProvider"
    );
  }

  return context;
}
