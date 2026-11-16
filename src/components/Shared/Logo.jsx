"use client";

import Link from "next/link";
import Image from "next/image";

export const BRAND_CONFIG = {
  name: "Soft License Hub",
  shortName: "SoftLicenseHub",
  logoPath: "/logo.png",
  tagline: "GENUINE DIGITAL LICENSES",
};

/**
 * Centralized Logo Component
 * Edit logo image, brand text, or styling here to update across the entire client site.
 *
 * @param {string|null|false} href - Destination URL (default: "/")
 * @param {"sm"|"md"|"lg"} size - Sizing preset (default: "md")
 * @param {boolean} showText - Whether to display the text logo (default: true)
 * @param {React.ReactNode} subtitle - Optional badge or subtitle under the brand name
 * @param {string} subtitleClassName - Extra styling for subtitle
 * @param {string} className - Extra styling for outer container
 * @param {string} textClassName - Custom classes for title text
 * @param {number} imageSize - Explicit width/height override in px
 * @param {boolean} priority - Next.js Image priority loading
 * @param {function} onClick - Click event callback
 */
export default function Logo({
  href = "/",
  size = "md",
  showText = true,
  subtitle = null,
  subtitleClassName = "",
  className = "",
  textClassName = "",
  imageSize,
  priority = false,
  onClick,
}) {
  const sizeMap = {
    sm: {
      box: "h-8 w-8",
      dim: 32,
      text: "text-base",
    },
    md: {
      box: "h-10 w-10",
      dim: 40,
      text: "text-base md:text-lg lg:text-xl",
    },
    lg: {
      box: "h-12 w-12",
      dim: 48,
      text: "text-xl md:text-2xl",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const dimension = imageSize || currentSize.dim;

  const content = (
    <>
      {/* Brand Icon / Image */}
      <div
        className={`relative flex ${currentSize.box} shrink-0 items-center justify-center overflow-hidden rounded-xl`}
      >
        <Image
          src={BRAND_CONFIG.logoPath}
          alt={`${BRAND_CONFIG.name} Logo`}
          width={dimension}
          height={dimension}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Brand Name Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-black [text-shadow:0_0_1px_rgba(0,0,0,0.5)] leading-tight ${currentSize.text} ${textClassName}`}
          >
            Soft{" "}
            <span className="gradient-text [text-shadow:0_0_1px_var(--primary)]">
              License
            </span>{" "}
            Hub
          </span>

          {subtitle && (
            <span
              className={`text-[10px] font-semibold tracking-wider ${subtitleClassName}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  const containerClasses = `inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={containerClasses}>
      {content}
    </div>
  );
}
