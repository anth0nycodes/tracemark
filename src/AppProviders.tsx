import type { ComponentType, ReactNode } from "react";
import { FabricCanvasProvider } from "@/context/fabric-canvas/FabricCanvasProvider";
import { ColorProvider } from "@/context/toolbar/color/ColorProvider";
import { EraserPopoverProvider } from "@/context/toolbar/eraser-popover/EraserPopoverProvider";
import { PencilPopoverProvider } from "@/context/toolbar/pencil-popover/PencilPopoverProvider";
import { TextPopoverProvider } from "@/context/toolbar/text-popover/TextPopoverProvider";

interface AppProvidersProps {
  children: ReactNode;
}

type ProviderComponent = ComponentType<{ children: ReactNode }>;

const providers: ProviderComponent[] = [
  FabricCanvasProvider,
  ColorProvider,
  PencilPopoverProvider,
  EraserPopoverProvider,
  TextPopoverProvider,
];

export function AppProviders({ children }: AppProvidersProps) {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
}
