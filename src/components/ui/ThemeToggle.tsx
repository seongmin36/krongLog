import { toggleTheme } from "@/lib/stores/theme";
import { AppIcon } from "@/components/ui/AppIcons";

const themeToggleButtonClass =
  "inline-flex items-center justify-center size-8 sm:size-9 border-none rounded-lg bg-transparent text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-200 hover:text-gray-900 hover:bg-black/5 dark:hover:text-gray-50 dark:hover:bg-white/8";

const themeToggleLabel = "다크모드 전환";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={themeToggleButtonClass}
      aria-label={themeToggleLabel}
      title={themeToggleLabel}
    >
      <AppIcon
        name="sun"
        className="hidden size-4 shrink-0 sm:size-4.5 dark:block"
      />
      <AppIcon
        name="moon"
        className="block size-4 shrink-0 sm:size-4.5 dark:hidden"
      />
    </button>
  );
}
