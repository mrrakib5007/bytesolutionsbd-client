import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import ProductsLoading from "./loading";

export const metadata = {
  title: "All Products & Software Licenses",
  description:
    "Explore our complete catalog of genuine software licenses, digital tools, subscriptions, and productivity suites with instant delivery and best prices in Bangladesh at Byte Solutions BD.",
  keywords: [
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
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
    title: "All Products & Software Licenses - Byte Solutions BD",
    description:
      "Explore our complete catalog of genuine software licenses, digital tools, subscriptions, and productivity suites with instant delivery and verified warranty at Byte Solutions BD.",
    url: "https://bytesolutionsbd.com/products",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/byte-logo.png",
        width: 1254,
        height: 1254,
        alt: "All Products - Byte Solutions BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products & Software Licenses - Byte Solutions BD",
    description:
      "Explore genuine software licenses and subscriptions with instant delivery at Byte Solutions BD.",
    images: ["/byte-logo.png"],
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
