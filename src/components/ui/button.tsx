import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { tv } from "tailwind-variants";

const button = tv({
  slots: {
    container:
      "my-2 flex flex-row items-center justify-center rounded-md px-4 cursor-pointer disabled:cursor-not-allowed",
    label: "font-inter text-base font-semibold",
    indicator:
      "animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full",
  },

  variants: {
    variant: {
      default: {
        container: "bg-black text-white dark:bg-white dark:text-black",
        label: "",
        indicator: "",
      },
      secondary: {
        container: "bg-primary-600 text-secondary-600",
        label: "",
        indicator: "text-white",
      },
      outline: {
        container: "border border-neutral-400 text-black dark:text-neutral-100",
        label: "",
        indicator: "",
      },
      destructive: {
        container: "bg-red-600 text-white",
        label: "",
        indicator: "",
      },
      ghost: {
        container: "bg-transparent text-black underline dark:text-white",
        label: "",
        indicator: "",
      },
      link: {
        container: "bg-transparent text-black",
        label: "",
        indicator: "",
      },
    },
    size: {
      default: {
        container: "h-10 px-4",
        label: "text-base",
      },
      lg: {
        container: "h-12 px-8",
        label: "text-xl",
      },
      sm: {
        container: "h-8 px-3",
        label: "text-sm",
      },
      icon: { container: "w-9 h-9" },
    },
    disabled: {
      true: {
        container:
          "bg-neutral-300 text-neutral-600 dark:bg-neutral-300 dark:text-neutral-600 opacity-60",
        indicator: "text-neutral-400 dark:text-neutral-400",
      },
    },
    fullWidth: {
      true: {
        container: "w-full",
      },
      false: {
        container: "mx-auto",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
    fullWidth: true,
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof button>;
type Props = {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
} & ButtonVariants &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

export function Button({
  ref,
  label: text,
  loading = false,
  variant = "default",
  disabled = false,
  size = "default",
  fullWidth = true,
  className = "",
  textClassName = "",
  ...props
}: Props & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const styles = React.useMemo(
    () => button({ variant, disabled, size, fullWidth }),
    [variant, disabled, size, fullWidth],
  );

  return (
    <button
      disabled={disabled || loading}
      className={styles.container({ className })}
      ref={ref}
      {...props}
    >
      {props.children ? (
        props.children
      ) : (
        <>
          {loading ? (
            <div className={styles.indicator()} aria-hidden="true" />
          ) : (
            <span className={styles.label({ className: textClassName })}>
              {text}
            </span>
          )}
        </>
      )}
    </button>
  );
}
