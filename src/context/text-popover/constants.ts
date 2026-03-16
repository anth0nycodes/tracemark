import { createContext, type Dispatch, type SetStateAction } from "react";
import { IText } from "fabric";

export type TextAlign = NonNullable<
  ConstructorParameters<typeof IText>[1]
>["textAlign"];

interface TextPopoverContextProps {
  textAlignment: TextAlign;
  setTextAlignment: Dispatch<SetStateAction<TextAlign>>;
}

export const TextPopoverContext = createContext<TextPopoverContextProps | null>(
  null
);
