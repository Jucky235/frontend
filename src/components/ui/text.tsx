import type { TxKeyPath } from "@/lib/i18n"; // Now this import will find the type!
import * as React from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next"; // Import the web hook

type Props = {
  className?: string;
  tx?: TxKeyPath;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "div";
} & React.HTMLAttributes<HTMLElement>;

export function Text({
  className = "",
  style,
  tx,
  children,
  as: Component = "p",
  ...props
}: Props) {
  // The t function handles your translations safely on the web
  const { t } = useTranslation();

  const textClassName = React.useMemo(
    () =>
      twMerge(
        "font-inter text-base font-normal text-black dark:text-white",
        className,
      ),
    [className],
  );

  return (
    <Component className={textClassName} style={style} {...props}>
      {/* If tx is provided, pass it to t(). Otherwise, fallback to children */}
      {tx ? t(tx) : children}
    </Component>
  );
}
