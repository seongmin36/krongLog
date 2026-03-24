import { atom } from "nanostores";

export const ThemeKey = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type ThemeType = (typeof ThemeKey)[keyof typeof ThemeKey];

function getStoredTheme(): ThemeType | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === ThemeKey.LIGHT || storedTheme === ThemeKey.DARK
      ? (storedTheme as ThemeType)
      : null;
  } catch (error) {
    return null;
  }
}

// 우선 순위 : localStorage -> system -> light
function resolveTheme(): ThemeType {
  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;
  if (typeof window === "undefined") return ThemeKey.LIGHT;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeKey.DARK
    : ThemeKey.LIGHT;
}

export const $theme = atom<ThemeType>(resolveTheme());

export function toggleTheme() {
  document.documentElement.classList.add("theme-transitioning");
  $theme.set($theme.get() === ThemeKey.DARK ? ThemeKey.LIGHT : ThemeKey.DARK);
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 300);
}

function applyToDOM(theme: ThemeType) {
  const isDark = theme === ThemeKey.DARK;
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

if (typeof window !== "undefined") {
  $theme.subscribe(applyToDOM);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!getStoredTheme()) {
        $theme.set(e.matches ? ThemeKey.DARK : ThemeKey.LIGHT);
      }
    });
}
