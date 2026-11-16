import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    let savedTheme: string | null = null;

    try {
      savedTheme = localStorage.getItem("theme");
    } catch {
      /* storage blocked */
    }

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      return savedTheme;
    }

    return "light";
  });

  useEffect(() => {
    // Update data-theme attribute
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    // Update body classes
    document.body.classList.remove(
      "light",
      "dark"
    );

    document.body.classList.add(theme);

    document.documentElement.style.colorScheme =
      theme;

    // Save preference
    try {
      localStorage.setItem(
        "theme",
        theme
      );
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}