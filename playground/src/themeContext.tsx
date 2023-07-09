import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

type ThemeProviderValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState = {
  theme: Theme.System,
  setTheme: () => null,
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
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme && Object.values(Theme).includes(storedTheme as Theme)) {
      return storedTheme as Theme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const documentElement = window.document.documentElement;

    documentElement.classList.remove("dark", "light");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      documentElement.classList.add(systemTheme);
    }

    documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    function handleThemeChange(event: MediaQueryListEvent) {
      if (theme === Theme.System) {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(
          event.matches ? "dark" : "light"
        );
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
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
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
