import { useEffect, useState } from "react";

const STORAGE_KEY = "lekh-theme";
const THEMES = ["light", "dark", "auto"];

function getSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(savedTheme) ? savedTheme : "dark";
  } catch {
    return "dark";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const resolvedTheme =
        theme === "auto" ? (darkQuery.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolvedTheme;
    }

    applyTheme();
    darkQuery.addEventListener("change", applyTheme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The theme still works for this visit without storage.
    }

    return () => darkQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  return [theme, setTheme];
}
