import { createContext, type Dispatch, type SetStateAction } from "react";

interface ColorContextProps {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}

export const ColorContext = createContext<ColorContextProps | null>(null);
