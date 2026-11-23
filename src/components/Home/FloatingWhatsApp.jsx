"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

/**
 * Floating WhatsApp Support Button Component
 * Rendered on the homepage at the bottom-right corner.
 * Directly links users to the support WhatsApp number (+8801991465007).
 */
export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = "8801991465007";
  const defaultMessage = encodeURIComponent(
    "Hello Byte Solutions BD! I need some support."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip / Label pill on hover */}
      <div
        className={`hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-white border border-emerald-200 text-gray-900 text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all duration-300 pointer-events-none select-none ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse shrink-0 ring-2 ring-[#25D366]/30" />
        <span className="tracking-wide">Chat with Support</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Byte Solutions BD on WhatsApp (+8801991465007)"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white ring-4 ring-[#25D366]/40 hover:ring-6 hover:ring-[#25D366]/50 shadow-lg hover:shadow-xl shadow-[#25D366]/35 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
      >
        {/* Radar Ping Animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10 pointer-events-none" />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="w-8 h-8 transition-transform duration-300 group-hover:rotate-6" />
      </a>
    </aside>
  );
}
