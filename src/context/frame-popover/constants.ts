import { createContext, type Dispatch, type SetStateAction } from "react";

export type FrameShape = "square" | "circle" | "diamond";

interface FramePopoverContextProps {
  frameShape: FrameShape;
  setFrameShape: Dispatch<SetStateAction<FrameShape>>;
}

export const FramePopoverContext =
  createContext<FramePopoverContextProps | null>(null);
