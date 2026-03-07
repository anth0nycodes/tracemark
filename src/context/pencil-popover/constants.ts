import { createContext, type Dispatch, type SetStateAction } from "react";

interface PencilPopoverContextProps {
  pencilWidth: number;
  setPencilWidth: Dispatch<SetStateAction<number>>;
}

export const PencilPopoverContext =
  createContext<PencilPopoverContextProps | null>(null);
