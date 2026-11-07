import { createContext } from "react";
import { storage } from "#imports";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export const themeStorage = storage.defineItem<Theme | null>("local:theme", {
  fallback: null,
});
