import { createContext } from "react";

interface ColorContextProps {
  color: string;
  setColor: (color: string) => void;
}

export const ColorContext = createContext<ColorContextProps>({
  color: "#FF0000",
  setColor: () => {},
});
