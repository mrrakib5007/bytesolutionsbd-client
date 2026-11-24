import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetailsPageClient from "./ProductDetailsPageClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";

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
    console.error("Failed to fetch products list from API:", error);
  }
  return [];
}

async function getProductBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) {
        return data;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch product '${slug}' from API:`, error);
  }
  return null;
}

export async function generateStaticParams() {
  const products = await getProducts();
  if (!products || !Array.isArray(products)) return [];

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested software license or product could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.title} - Genuine License | Trusted Marketplace for Digital Products`;
  const description =
    product.shortDescription ||
    `Purchase genuine ${product.title} with instant license key delivery, verified warranty, and dedicated 24/7 support at Byte Solutions BD — your Trusted Marketplace for Digital Products.`;

  const canonicalPath = `/products/${product.slug}`;
  const lowestPrice = product.variants?.[0]?.price;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category,
      "Trusted Marketplace for Digital Products",
      "Marketplace for Digital Products",
      "Byte Solutions BD",
      "ByteSolutionsBD",
      "software license",
      "buy license bd",
      "instant activation",
      "genuine activation key",
      "international digital product services",
      ...(product.features || []),
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${product.title} | Trusted Marketplace for Digital Products`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: "Byte Solutions BD",
      type: "website",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: `${product.title} - Byte Solutions BD`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Byte Solutions BD`,
      description,
      images: [product.image],
    },
    other: lowestPrice
      ? {
          "product:price:amount": String(lowestPrice),
          "product:price:currency": "BDT",
        }
      : {},
  };
}

function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-gray-200 rounded-md" />
        <div className="h-4 w-3 bg-gray-200 rounded-md" />
        <div className="h-4 w-16 bg-gray-200 rounded-md" />
        <div className="h-4 w-3 bg-gray-200 rounded-md" />
        <div className="h-4 w-28 bg-gray-200 rounded-md" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-gray-100 rounded-3xl border border-gray-200" />
        <div className="space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded-lg" />
          <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
          <div className="h-5 w-1/3 bg-gray-200 rounded-lg" />
          <div className="h-20 w-full bg-gray-100 rounded-2xl" />
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetailsContent({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const lowestPrice = product.variants?.[0]?.price || 0;
  const highestPrice =
    product.variants?.[product.variants.length - 1]?.price || lowestPrice;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.image],
    description:
      product.shortDescription || product.longDescription || product.title,
    sku: product.slug,
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: "Byte Solutions BD",
    },
    offers: {
      "@type":
        product.variants && product.variants.length > 1
          ? "AggregateOffer"
          : "Offer",
      priceCurrency: "BDT",
      price: lowestPrice,
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants?.length || 1,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Byte Solutions BD",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.9,
      bestRating: "5",
      worstRating: "1",
      ratingCount: product.reviewsCount || 35,
      reviewCount: product.reviewsCount || 35,
    },
  };

  const breadcrumbJsonLd = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${SITE_URL}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailsPageClient product={product} />
    </>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
