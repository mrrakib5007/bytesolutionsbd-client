import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import ProductsLoading from "./loading";

export const metadata = {
  title: "All Products & Software Licenses | Trusted Marketplace for Digital Products",
  description:
    "Explore genuine software licenses, WhatsApp marketing tools, Canva Pro, Windows 11 keys, Office 365, VPNs, and AI subscriptions with instant delivery at Byte Solutions BD — the Trusted Marketplace for Digital Products.",
  keywords: [
    "Trusted Marketplace for Digital Products",
    "Marketplace for Digital Products",
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
    "software licenses",
    "buy software licenses bd",
    "digital keys",
    "canva pro subscription",
    "wa sender marketing suite",
    "WhatsApp Sender Pro",
    "Windows 11 Pro license key",
    "Office 365 subscription",
    "ChatGPT Plus subscription",
    "NordVPN ExpressVPN",
    "marketing tools",
    "design tools",
    "productivity software",
    "cheap genuine software",
    "instant license delivery",
    "international digital product services",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "All Products & Software Licenses | Trusted Marketplace for Digital Products",
    description:
      "Explore genuine software licenses, developer tools, subscriptions, and marketing suites with instant delivery and verified warranty on Byte Solutions BD.",
    url: "https://bytesolutionsbd.vercel.app/products",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "All Products - Byte Solutions BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products & Software Licenses | Byte Solutions BD",
    description:
      "Explore genuine software licenses and subscriptions with instant delivery on the Trusted Marketplace for Digital Products.",
    images: ["/og-image.png"],
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "All Software Licenses & Digital Products",
  description:
    "Explore genuine software licenses, digital tools, subscriptions, and productivity suites at Byte Solutions BD.",
  url: `${SITE_URL}/products`,
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
      name: "Products",
      item: `${SITE_URL}/products`,
    },
  ],
};

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch products from backend API:", error);
  }

  return [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient initialProducts={products} />
      </Suspense>
    </>
  );
}
