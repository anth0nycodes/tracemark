import { createContext, type Dispatch, type SetStateAction } from "react";

interface HighlighterPopoverContextProps {
  highlighterWidth: number;
  setHighlighterWidth: Dispatch<SetStateAction<number>>;
}

export const HighlighterPopoverContext =
  createContext<HighlighterPopoverContextProps | null>(null);
