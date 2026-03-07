import type { ReactNode } from "react";
import { ShadowContainerContext } from "./constants";

export function ShadowContainerProvider({
  container,
  children,
}: {
  container: HTMLElement;
  children: ReactNode;
}) {
  return (
    <ShadowContainerContext.Provider value={container}>
      {children}
    </ShadowContainerContext.Provider>
  );
}
