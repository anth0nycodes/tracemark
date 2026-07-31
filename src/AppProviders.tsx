import type { ComponentType, ReactNode } from "react";
import { FabricCanvasProvider } from "@/context/fabric-canvas/FabricCanvasProvider";
import { ColorProvider } from "@/context/toolbar/color/ColorContext";
import { EraserPopoverProvider } from "@/context/toolbar/eraser-popover/PopoverProvider";
import { PencilPopoverProvider } from "@/context/toolbar/pencil-popover/PopoverProvider";
import { TextPopoverProvider } from "@/context/toolbar/text-popover/PopoverProvider";

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
