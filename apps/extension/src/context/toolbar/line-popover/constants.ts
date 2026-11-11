import { createContext } from "react";

export type LineStyle = "Line" | "Arrow" | "DoubleArrow";

interface LinePopoverContextProps {
  lineStyle: LineStyle;
  setLineStyle: (lineStyle: LineStyle) => void;
}

export const LinePopoverContext = createContext<LinePopoverContextProps | null>(
  null
);
