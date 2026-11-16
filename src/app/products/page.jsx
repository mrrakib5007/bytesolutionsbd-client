import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import ProductsLoading from "./loading";

export const metadata = {
  title: "All Products & Software Licenses",
  description:
    "Explore our complete catalog of genuine software licenses, digital tools, subscriptions, and productivity suites with instant delivery and best prices in Bangladesh.",
  keywords: [
    "software licenses",
    "buy software licenses bd",
    "digital keys",
    "canva pro subscription",
    "wa sender marketing suite",
    "marketing tools",
    "design tools",
    "productivity software",
    "cheap genuine software",
    "instant license delivery",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "All Products & Software Licenses - Soft License Hub",
    description:
      "Explore our complete catalog of genuine software licenses, digital tools, subscriptions, and productivity suites with instant delivery and verified warranty.",
    url: "https://softlicensehub.com/products",
    siteName: "Soft License Hub",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "All Products - Soft License Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products & Software Licenses - Soft License Hub",
    description:
      "Explore genuine software licenses and subscriptions with instant delivery.",
    images: ["/og-image.png"],
  },
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
