import { createContext, type Dispatch, type SetStateAction } from "react";

interface EraserPopoverContextProps {
  eraserWidth: number;
  setEraserWidth: Dispatch<SetStateAction<number>>;
}

export const EraserPopoverContext = createContext<EraserPopoverContextProps>({
  eraserWidth: 5,
  setEraserWidth: () => {},
});
