import { notFound } from "next/navigation";
import ProductDetailsPageClient from "./ProductDetailsPageClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const title = `${product.title} - Genuine License Key`;
  const description =
    product.shortDescription ||
    `Purchase genuine ${product.title} with instant delivery, verified license, and dedicated support at Byte Solutions BD.`;

  const canonicalPath = `/products/${product.slug}`;
  const lowestPrice = product.variants?.[0]?.price;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category,
      "Byte Solutions BD",
      "ByteSolutionsBD",
      "software license",
      "buy license bd",
      "instant activation",
      ...(product.features || []),
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${product.title} | Byte Solutions BD`,
      description,
      url: `https://bytesolutionsbd.vercel.app${canonicalPath}`,
      siteName: "Byte Solutions BD",
      type: "article",
      images: [
        {
          url: product.image,
          width: 950,
          height: 700,
          alt: product.title,
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

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsPageClient product={product} />;
}
