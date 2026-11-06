import { createContext, type Dispatch, type SetStateAction } from "react";

export type TextAlign = "left" | "center" | "right";

interface TextPopoverContextProps {
  textAlignment: TextAlign;
  setTextAlignment: Dispatch<SetStateAction<TextAlign>>;
}

export const TextPopoverContext = createContext<TextPopoverContextProps | null>(
  null
);
