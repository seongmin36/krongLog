type TagColor = {
  bg: string;
  text: string;
};

const TAG_COLORS: Record<string, TagColor> = {
  React:                { bg: "bg-sky-100 dark:bg-sky-900/40",         text: "text-sky-700 dark:text-sky-300" },

};

const DEFAULT_COLOR: TagColor = {
  bg: "bg-gray-100 dark:bg-gray-800",
  text: "text-gray-600 dark:text-gray-400",
};

export function getTagColor(tag: string): TagColor {
  return TAG_COLORS[tag] ?? DEFAULT_COLOR;
}
