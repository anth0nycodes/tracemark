import type { ComponentType, ReactNode } from "react";
import { ColorProvider } from "@/context/color/ColorContext";
import { EraserPopoverProvider } from "@/context/eraser-popover/PopoverProvider";
import { PencilPopoverProvider } from "@/context/pencil-popover/PopoverProvider";
import { TextPopoverProvider } from "@/context/text-popover/PopoverProvider";

interface AppProvidersProps {
  children: ReactNode;
}

type ProviderComponent = ComponentType<{ children: ReactNode }>;

const providers: ProviderComponent[] = [
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
