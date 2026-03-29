import type { SVGProps } from "react";
import SunIcon from "@/assets/icons/icon-sun.svg?react";
import MoonIcon from "@/assets/icons/icon-moon.svg?react";
import GithubIcon from "@/assets/icons/icon-github.svg?react";
import LinkedinIcon from "@/assets/icons/icon-linkedin.svg?react";

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
} as const;

type IconName = keyof typeof ICONS;

type AppIconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  className?: string;
};

export const AppIcon = ({ name, className, ...props }: AppIconProps) => {
  const Icon = ICONS[name];
  return <Icon className={className} focusable={false} {...props} />;
};
