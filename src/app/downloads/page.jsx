import { Suspense } from "react";
import DownloadsClient from "./DownloadsClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";

export const metadata = {
  title: "Software Downloads & Setup Utilities | Trusted Marketplace for Digital Products",
  description:
    "Download official software setups, WhatsApp marketing automation suites, utility tools, and activation diagnostic companions with direct high-speed links and zero ads at Byte Solutions BD.",
  keywords: [
    "Trusted Marketplace for Digital Products",
    "Marketplace for Digital Products",
    "Byte Solutions BD downloads",
    "download whatsapp sender pro",
    "software downloads bd",
    "activation tools download",
    "marketing software setup",
    "free direct software downloads",
    "windows utilities",
    "canva pro design companion",
  ],
  alternates: {
    canonical: "/downloads",
  },
  openGraph: {
    title: "Software Downloads & Setup Utilities | Trusted Marketplace for Digital Products",
    description:
      "Download official WhatsApp marketing tools, diagnostic suites, and setup utilities directly with high speed from Byte Solutions BD.",
    url: `${SITE_URL}/downloads`,
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Software Downloads - Byte Solutions BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Downloads | Byte Solutions BD",
    description:
      "Download certified software packages and marketing suites directly on the Trusted Marketplace for Digital Products.",
    images: ["/og-image.png"],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Software & Digital Tools Downloads",
  description:
    "Official software packages, marketing tools, utilities, and setup guides verified by Byte Solutions BD.",
  url: `${SITE_URL}/downloads`,
  isPartOf: {
    "@type": "WebSite",
    name: "Byte Solutions BD",
    url: SITE_URL,
  },
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Software Downloads",
      item: `${SITE_URL}/downloads`,
    },
  ],
};

async function getDownloads() {
  try {
    const res = await fetch(`${API_BASE_URL}/downloads`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch downloads list from backend API:", error);
  }

  return [];
}

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Suspense
        fallback={
          <div className="py-20 text-center text-sm font-semibold text-gray-500">
            Loading software catalog...
          </div>
        }
      >
        <DownloadsClient initialDownloads={downloads} />
      </Suspense>
    </div>
  );
}
