"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiExternalLink,
  FiCheckCircle,
  FiShield,
  FiLayers,
  FiFileText,
  FiTag,
  FiChevronRight,
  FiMessageSquare,
  FiHardDrive,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaWindows,
  FaApple,
  FaAndroid,
  FaLinux,
  FaStar,
  FaStarHalfStroke,
} from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";

const DEFAULT_IMAGE = "https://i.ibb.co.com/Gv1GBtWZ/WA-Sender-Marketing-Tool-Offer.png";

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
  return <FiShield className="h-4 w-4 text-(--primary) shrink-0" />;
}

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
        <FaStar key={i} className="h-4 w-4 text-gray-200 fill-gray-200" />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs font-bold text-gray-700 ml-1">
        {numRating.toFixed(1)}
      </span>
    </div>
  );
}

export default function SoftwareDetailsView({ software }) {
  const [downloadCount, setDownloadCount] = useState(
    software?.totalDownloads || 0
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  const handleDownload = async () => {
    if (isRateLimited) {
      toast.error(
        rateLimitMessage || "Too many requests. Please wait and try again later."
      );
      return;
    }

    if (!software.downloadUrl) {
      toast.error("Download URL is currently unavailable.");
      return;
    }

    setIsDownloading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${API_BASE_URL}/downloads/${software._id}/track-download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      // Handle 429 Rate Limit
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        const msg =
          errorData?.message ||
          "Too many requests. Please wait and try again later.";
        setIsRateLimited(true);
        setRateLimitMessage(msg);
        toast.error(msg, { duration: 6000 });
        setIsDownloading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (typeof data?.data?.totalDownloads === "number") {
          setDownloadCount(data.data.totalDownloads);
        } else {
          setDownloadCount((prev) => prev + 1);
        }
        toast.success(`Starting download for ${software.title}...`);
        window.open(software.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData?.message || "Unable to complete download request.");
      }
    } catch {
      // In case of unexpected network failure, gracefully allow download
      toast.success(`Starting download for ${software.title}...`);
      window.open(software.downloadUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-(--primary) transition-colors">
          Home
        </Link>
        <FiChevronRight className="h-3 w-3 text-gray-400" />
        <Link href="/downloads" className="hover:text-(--primary) transition-colors">
          Downloads
        </Link>
        <FiChevronRight className="h-3 w-3 text-gray-400" />
        <span className="font-semibold text-gray-900 truncate max-w-60">
          {software.title}
        </span>
      </nav>

      {/* Main Software Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Icon & Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden shrink-0 border border-gray-200 bg-gray-50 shadow-xs">
              <Image
                src={software.image || DEFAULT_IMAGE}
                alt={software.title}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {software.version || "v1.0.0"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700">
                  <PlatformIcon platform={software.platform} />
                  <span>{software.platform || "Windows"}</span>
                </span>
                <span className="text-xs font-semibold text-(--primary)">
                  {software.category || "Utilities"}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
                {software.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                {software.shortDescription ||
                  "Verified, virus-free official software setup package for instant download."}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={software.rating || 5} />
                </div>
                <div className="h-3 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-600 font-mono">
                  <LuDownload className="h-3.5 w-3.5 text-gray-400" />
                  <span>{Number(downloadCount).toLocaleString()} Downloads</span>
                </div>
                <div className="h-3 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-600 font-mono font-bold">
                  <FiHardDrive className="h-3.5 w-3.5 text-gray-400" />
                  <span>{software.fileSize || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Big Download Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || isRateLimited}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all ${
                isRateLimited
                  ? "bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed shadow-none"
                  : isDownloading
                  ? "bg-gray-100 text-gray-400 cursor-wait shadow-none"
                  : "bg-(--primary) hover:bg-(--primary-hover) text-white shadow-(--primary)/25 active:scale-98 cursor-pointer"
              }`}
            >
              {isRateLimited ? (
                <>
                  <FiAlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Too many requests, please wait...</span>
                </>
              ) : isDownloading ? (
                <span>Starting Download...</span>
              ) : (
                <>
                  <FiDownload className="h-4 w-4" />
                  <span>Download ({software.fileSize || "File"})</span>
                </>
              )}
            </button>

            {isRateLimited && (
              <p className="text-[11px] text-amber-700 font-medium text-center max-w-64">
                Download limit reached (max 10 downloads per 10 mins). Please wait before trying again.
              </p>
            )}

            {software.externalUrl && (
              <a
                href={software.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              >
                <FiExternalLink className="h-3.5 w-3.5 text-gray-400" />
                <span>Official Documentation</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Instructions & Features + Quick Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Instructions & Details (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions & Setup Guide */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-(--primary)" />
              <span>Installation Instructions & Setup Guide</span>
            </h2>

            {software.description ? (
              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {software.description}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">
                1. Click the green &quot;Download&quot; button to save the setup installer file.
                <br />
                2. Extract or run the downloaded installer on your system.
                <br />
                3. Follow on-screen prompts to complete the installation process.
                <br />
                4. For activation or license keys, visit the Byte Solutions BD store.
              </p>
            )}
          </div>

          {/* Safe & Verified Guarantee Box */}
          <div className="bg-linear-to-r from-emerald-50 to-green-50/50 rounded-2xl border border-emerald-200/60 p-5 flex items-start gap-3.5">
            <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-950">
                100% Virus-Free & Verified Official Package
              </h3>
              <p className="text-xs text-emerald-800/80 leading-relaxed">
                Every software release hosted or linked on Byte Solutions BD is tested, scanned against malware, and verified authentic.
              </p>
            </div>
          </div>

          {/* Tags */}
          {Array.isArray(software.tags) && software.tags.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-5 space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FiTag className="h-3.5 w-3.5" /> Tags & Keywords
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {software.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Package Summary & Support */}
        <div className="space-y-6">
          {/* Package Quick Specs Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FiLayers className="h-4 w-4 text-(--primary)" /> Package Specifications
            </h3>

            <div className="divide-y divide-gray-100 text-xs space-y-2.5">
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-500">Release Version</span>
                <span className="font-mono font-bold text-gray-900">
                  {software.version || "v1.0.0"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-gray-500">File Size</span>
                <span className="font-mono font-bold text-gray-900">
                  {software.fileSize || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-gray-500">Platform</span>
                <span className="font-semibold text-gray-900">
                  {software.platform || "Windows"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-gray-500">License Type</span>
                <span className="font-semibold text-emerald-700">Official Free Setup / Trial</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || isRateLimited}
              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shadow-xs transition-all mt-2 ${
                isRateLimited
                  ? "bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed shadow-none"
                  : isDownloading
                  ? "bg-gray-100 text-gray-400 cursor-wait shadow-none"
                  : "bg-(--primary) hover:bg-(--primary-hover) text-white cursor-pointer"
              }`}
            >
              {isRateLimited ? (
                <>
                  <FiAlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Too many requests, please wait...</span>
                </>
              ) : isDownloading ? (
                <span>Preparing...</span>
              ) : (
                <>
                  <FiDownload className="h-4 w-4" />
                  <span>Download Now</span>
                </>
              )}
            </button>
          </div>

          {/* Need License / Support Help Box */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 space-y-3">
            <div className="flex items-center gap-2 text-(--primary)">
              <FiMessageSquare className="h-5 w-5" />
              <h4 className="text-sm font-bold text-gray-900">Need Dedicated Help?</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              If you need assistance with software setup, license activation, or premium tool keys, chat with our support team on WhatsApp.
            </p>
            <a
              href="https://wa.me/8801991465007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-xs font-bold text-gray-700 transition-colors"
            >
              <span>Chat with Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
