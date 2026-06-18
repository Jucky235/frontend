import * as React from "react";
import { twMerge } from "tailwind-merge";

export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

export function Image({
  style,
  className = "",
  loading = "lazy", // Web best practice: default to lazy-loading offscreen images
  alt = "", // Important for web accessibility (a11y)
  ...props
}: ImgProps) {
  // Cleanly merge layout/styling classes
  const imageClassName = React.useMemo(
    () => twMerge("max-w-full h-auto", className),
    [className],
  );

  return (
    <img
      className={imageClassName}
      style={style}
      loading={loading}
      alt={alt}
      {...props}
    />
  );
}

/**
 * Preloads image URLs into the browser cache so they render instantly when needed.
 * This replaces Expo's NImage.prefetch() using native Web APIs.
 */
export function preloadImages(sources: string[]) {
  if (typeof window === "undefined") return; // Safety check for server environments

  sources.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}
