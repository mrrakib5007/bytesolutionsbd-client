"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaWindows,
  FaApple,
  FaAndroid,
  FaLinux,
  FaStar,
  FaStarHalfStroke,
} from "react-icons/fa6";
import { BsCloudArrowDown } from "react-icons/bs";
import { FiMonitor } from "react-icons/fi";

const DEFAULT_IMAGE = "https://i.ibb.co.com/Gv1GBtWZ/WA-Sender-Marketing-Tool-Offer.png";

/**
 * Helper to render OS icon matching platform
 */
function PlatformIcon({ platform }) {
  const p = (platform || "").toLowerCase();
  if (p.includes("win")) {
    return <FaWindows className="h-4 w-4 text-[#00adef] shrink-0" />;
  }
  if (p.includes("mac") || p.includes("apple") || p.includes("ios")) {
    return <FaApple className="h-4 w-4 text-gray-700 shrink-0" />;
  }
  if (p.includes("android")) {
    return <FaAndroid className="h-4 w-4 text-[#3DDC84] shrink-0" />;
  }
  if (p.includes("linux")) {
    return <FaLinux className="h-4 w-4 text-amber-600 shrink-0" />;
  }
  return <FiMonitor className="h-4 w-4 text-(--primary) shrink-0" />;
}

/**
 * Helper to render 5-star rating matching the screenshot
 */
function RatingStars({ rating = 5 }) {
  const numRating = Number(rating) || 5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (numRating >= i) {
      stars.push(
        <FaStar key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
      );
    } else if (numRating >= i - 0.5) {
      stars.push(
        <FaStarHalfStroke
          key={i}
          className="h-4 w-4 text-amber-400 fill-amber-400"
        />
      );
    } else {
      stars.push(
        <FaStar key={i} className="h-4 w-4 text-gray-300 fill-gray-300" />
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function DownloadCard({ software }) {
  if (!software) return null;

  return (
    <Link
      href={`/downloads/${software.slug}`}
      className="block group"
    >
      <div className="bg-white rounded-sm border border-gray-200 hover:border-gray-300 hover:shadow-xs transition-all p-3 sm:py-3.5 sm:px-4 md:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        {/* Column 1: Software 1:1 Image + Title + Version + Short Description + Category */}
        <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 aspect-square shrink-0 border border-gray-200 bg-gray-50 overflow-hidden">
            <Image
              src={software.image || DEFAULT_IMAGE}
              alt={software.title}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-(--primary) transition-colors leading-snug truncate">
              {software.title}
              {software.version && !software.title.toLowerCase().includes(software.version.toLowerCase()) ? (
                <span className="font-semibold text-gray-800 ml-1.5">{software.version}</span>
              ) : null}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate leading-relaxed">
              {software.shortDescription || "Safe, virus-free official software setup package."}
            </p>

            <p className="text-xs sm:text-sm font-semibold text-[#008c9e] sm:text-(--primary) mt-1 truncate">
              {software.category || "Utilities & Tools"}
            </p>
          </div>
        </div>

        {/* Vertical Divider 1 */}
        <div className="hidden md:block w-px h-12 lg:h-14 bg-gray-200 shrink-0 mx-3 lg:mx-5" />

        {/* Column 2: Platform & Total Downloads */}
        <div className="hidden md:flex flex-col justify-center gap-1.5 md:w-28 lg:w-32 shrink-0">
          <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-gray-800">
            <PlatformIcon platform={software.platform} />
            <span>{software.platform || "Windows"}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <BsCloudArrowDown className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{Number(software.totalDownloads || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Vertical Divider 2 */}
        <div className="hidden md:block w-px h-12 lg:h-14 bg-gray-200 shrink-0 mx-3 lg:mx-5" />

        {/* Column 3: Rating (Stars) */}
        <div className="hidden md:flex flex-col justify-center md:w-28 lg:w-32 shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
            Rating
          </span>
          <RatingStars rating={software.rating || 5} />
        </div>

        {/* Vertical Divider 3 */}
        <div className="hidden md:block w-px h-12 lg:h-14 bg-gray-200 shrink-0 mx-3 lg:mx-5" />

        {/* Column 4: File Size */}
        <div className="hidden md:flex items-center justify-center md:w-24 lg:w-28 shrink-0">
          <span className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 tracking-tight">
            {software.fileSize || "N/A"}
          </span>
        </div>

        {/* Mobile Sub-Row (< md) */}
        <div className="flex md:hidden items-center justify-between pt-2.5 mt-1 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              <PlatformIcon platform={software.platform} />
              <span>{software.platform || "Windows"}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <BsCloudArrowDown className="h-3.5 w-3.5 text-gray-400" />
              <span>{Number(software.totalDownloads || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={software.rating || 5} />
            <span className="font-bold text-gray-900">{software.fileSize || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
