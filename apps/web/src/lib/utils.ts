import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge doesn't know the custom "-plus" sizes and reads them as text
// colors, so `text-primary-foreground text-2xl-plus` would drop the color.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["2xl-plus", "3xl-plus", "4xl-plus"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
