import { atom } from "nanostores";

export type Theme = "light" | "dark";

export const $theme = atom<Theme>("light");

function getStoredTheme(): Theme | null {
  if (typeof localStorage === "undefined") return null;
  const storedTheme = localStorage.getItem("theme");
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

// 초기 테마 resolve -> store에 반영
function resolveTheme(): Theme {
  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyToDOM(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function toggleTheme() {
  $theme.set($theme.get() === "dark" ? "light" : "dark");
}

if (typeof window !== "undefined") {
  $theme.set(resolveTheme());
  $theme.subscribe(applyToDOM);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!getStoredTheme()) {
        $theme.set(e.matches ? "dark" : "light");
      }
    });
}

let initialized = false;

// 클라이언트 1회 호출
export function initThemeStore() {
  if (initialized) return;
  initialized = true;

  $theme.set(resolveTheme());

  $theme.subscribe(applyToDOM);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!getStoredTheme()) {
        $theme.set(e.matches ? "dark" : "light");
      }
    });
}
