import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useShadowContainer } from "@/context/shadow-dom/use-shadow-container";
import { getErrorMessage } from "@/lib/helpers";
import { ThemeContext, themeStorage, type Theme } from "./constants";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const shadowContainer = useShadowContainer();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    themeStorage
      .getValue()
      .then((storedTheme) => setTheme(storedTheme ?? getSystemTheme()))
      // Never leave the overlay unrendered just because storage failed
      .catch((error) => {
        console.error("Failed to load saved theme:", getErrorMessage(error));
        setTheme(getSystemTheme());
      });
  }, []);

  useEffect(() => {
    if (!theme) return;
    shadowContainer.classList.toggle("dark", theme === "dark");
  }, [shadowContainer, theme]);

  const value = useMemo(() => {
    if (!theme) return null;

    return {
      theme,
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        themeStorage.setValue(nextTheme).catch((error) => {
          console.error("Failed to save theme:", getErrorMessage(error));
        });
      },
    };
  }, [theme]);

  // Hold off rendering until the saved theme is known, so the overlay never
  // flashes the wrong theme before switching (storage reads take a few ms)
  if (!value) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
