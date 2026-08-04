import { createContext } from "react";

export type Frame = "Rect" | "Triangle" | "Circle";

interface FramePopoverContextProps {
  frame: Frame;
  setFrame: (frame: Frame) => void;
}

export const FramePopoverContext =
  createContext<FramePopoverContextProps | null>(null);
