import { Suspense } from "react";
import { notFound } from "next/navigation";
import SoftwareDetailsView from "./SoftwareDetailsView";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";

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
    console.error("Failed to fetch downloads list:", error);
  }
  return [];
}

async function getDownloadBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/downloads/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data) {
        return data.data;
      }
      if (data && data.title) {
        return data;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch software '${slug}':`, error);
  }
  return null;
}

export async function generateStaticParams() {
  const downloads = await getDownloads();
  if (!downloads || !Array.isArray(downloads)) return [];

  return downloads.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const software = await getDownloadBySlug(slug);

  if (!software) {
    return {
      title: "Software Not Found | Byte Solutions BD",
      description: "The requested software download could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${software.title} (${software.version || "Latest"}) Download | Byte Solutions BD`;
  const description =
    software.shortDescription ||
    `Download ${software.title} safe, virus-free, and verified with direct high-speed links at Byte Solutions BD.`;

  const canonicalPath = `/downloads/${software.slug}`;

  return {
    title,
    description,
    keywords: [
      software.title,
      software.category,
      software.platform,
      "software download",
      "download setup",
      "Byte Solutions BD downloads",
      "free download",
      ...(software.tags || []),
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${software.title} - Download Setup | Byte Solutions BD`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: "Byte Solutions BD",
      type: "website",
      images: [
        {
          url: software.image || "/og-image.png",
          width: 1200,
          height: 630,
          alt: software.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${software.title} Download | Byte Solutions BD`,
      description,
      images: [software.image || "/og-image.png"],
    },
  };
}

function SoftwareDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-gray-200 rounded-md" />
        <div className="h-4 w-3 bg-gray-200 rounded-md" />
        <div className="h-4 w-16 bg-gray-200 rounded-md" />
        <div className="h-4 w-3 bg-gray-200 rounded-md" />
        <div className="h-4 w-28 bg-gray-200 rounded-md" />
      </div>

      {/* Main card skeleton */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
          <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 border border-gray-200 shrink-0 aspect-square" />
          <div className="space-y-2 flex-1 w-full">
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-gray-200 rounded-lg" />
              <div className="h-5 w-20 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-7 w-2/3 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="h-12 w-48 bg-gray-200 rounded-2xl shrink-0" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-white rounded-3xl border border-gray-200/90" />
        <div className="h-64 bg-white rounded-3xl border border-gray-200/90" />
      </div>
    </div>
  );
}

async function SoftwareDetailsContent({ params }) {
  const { slug } = await params;
  const software = await getDownloadBySlug(slug);

  if (!software) {
    notFound();
  }

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: software.title,
    operatingSystem: software.platform || "Windows",
    applicationCategory: software.category || "UtilitiesApplication",
    softwareVersion: software.version || "1.0",
    fileSize: software.fileSize || "N/A",
    image: software.image,
    downloadUrl: software.downloadUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: software.rating || 5,
      bestRating: "5",
      worstRating: "1",
      ratingCount: software.totalDownloads || 150,
      reviewCount: software.totalDownloads || 150,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
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
        name: "Downloads",
        item: `${SITE_URL}/downloads`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: software.title,
        item: `${SITE_URL}/downloads/${software.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <SoftwareDetailsView software={software} />
    </>
  );
}

export default function SoftwareDetailsPage({ params }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Suspense fallback={<SoftwareDetailsSkeleton />}>
        <SoftwareDetailsContent params={params} />
      </Suspense>
    </div>
  );
}
