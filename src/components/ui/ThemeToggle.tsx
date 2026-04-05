import { toggleTheme } from "@/lib/stores/theme";
import { AppIcon } from "@/components/ui/AppIcons";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center size-8 sm:size-9 border-none rounded-lg bg-transparent text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-200 hover:text-gray-900 hover:bg-black/5 dark:hover:text-gray-50 dark:hover:bg-white/8"
      aria-label="다크모드 전환"
      title="다크모드 전환"
    >
      <AppIcon
        name="sun"
        className="size-4 sm:size-4.5 shrink-0 hidden dark:block"
      />
      <AppIcon
        name="moon"
        className="size-4 sm:size-4.5 shrink-0 block dark:hidden"
      />
    </button>
  );
}