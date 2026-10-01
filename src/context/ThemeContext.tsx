import {
  createContext,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference =
  | "light"
  | "dark"
  | "system";

export type ResolvedTheme =
  | "light"
  | "dark";

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (
    theme: ThemePreference,
  ) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY =
  "prompt.theme";

export const ThemeContext =
  createContext<
    ThemeContextValue | undefined
  >(undefined);

function getStoredTheme():
  ThemePreference {
  const saved =
    localStorage.getItem(
      THEME_STORAGE_KEY,
    );

  if (
    saved === "light" ||
    saved === "dark" ||
    saved === "system"
  ) {
    return saved;
  }

  return "system";
}

function getSystemTheme():
  ResolvedTheme {
  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

function resolveTheme(
  theme: ThemePreference,
): ResolvedTheme {
  if (theme === "system") {
    return getSystemTheme();
  }

  return theme;
}

function applyTheme(
  theme: ResolvedTheme,
) {
  const root =
    document.documentElement;

  root.dataset.theme =
    theme;

  root.style.colorScheme =
    theme;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    theme,
    setThemeState,
  ] =
    useState<ThemePreference>(
      getStoredTheme,
    );

  const [
    resolvedTheme,
    setResolvedTheme,
  ] =
    useState<ResolvedTheme>(
      () =>
        resolveTheme(
          getStoredTheme(),
        ),
    );

  useLayoutEffect(() => {
    const resolved =
      resolveTheme(theme);

    setResolvedTheme(
      resolved,
    );

    applyTheme(
      resolved,
    );
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const media =
      window.matchMedia(
        "(prefers-color-scheme: dark)",
      );

    function handleChange() {
      const resolved =
        media.matches
          ? "dark"
          : "light";

      setResolvedTheme(
        resolved,
      );

      applyTheme(
        resolved,
      );
    }

    media.addEventListener(
      "change",
      handleChange,
    );

    return () => {
      media.removeEventListener(
        "change",
        handleChange,
      );
    };
  }, [theme]);

  function setTheme(
    newTheme:
      ThemePreference,
  ) {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      newTheme,
    );

    setThemeState(
      newTheme,
    );
  }

  const value =
    useMemo(
      () => ({
        theme,
        resolvedTheme,
        setTheme,
      }),
      [
        theme,
        resolvedTheme,
      ],
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}