import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalState } from "@/hooks/useLocalState.ts";

export enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

export type EffectiveTheme = Theme.Light | Theme.Dark;

type ThemeProviderValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: EffectiveTheme;
};

const initialState = {
  theme: Theme.System,
  setTheme: () => null,
  effectiveTheme: Theme.Light as EffectiveTheme,
};

const ThemeContext = createContext<ThemeProviderValue>(initialState);

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export const ThemeProvider = ({
  children,
  defaultTheme = Theme.System,
  storageKey = "ape-theme",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useLocalState(defaultTheme, storageKey);
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(
    Theme.Light
  );

  useEffect(() => {
    const documentElement = window.document.documentElement;

    documentElement.classList.remove("dark", "light");

    if (theme === Theme.System) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? Theme.Dark
        : Theme.Light;
      documentElement.classList.add(systemTheme);
      setEffectiveTheme(systemTheme);
    }

    documentElement.classList.add(theme);
    // ts... -_-
    setEffectiveTheme(theme as EffectiveTheme);
  }, [theme]);

  useEffect(() => {
    function handleThemeChange(event: MediaQueryListEvent) {
      if (theme === Theme.System) {
        document.documentElement.classList.remove("dark", "light");
        const newTheme = event.matches ? Theme.Dark : Theme.Light;
        document.documentElement.classList.add(newTheme);
        setEffectiveTheme(newTheme as unknown as EffectiveTheme);
      }
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleThemeChange);
    };
  }, []);

  const value = {
    theme,
    setTheme,
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
