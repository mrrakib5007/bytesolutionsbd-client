import BannerSection from "@/components/Home/BannerSection";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedProductsSection from "@/components/Home/FeaturedProductsSection";

export const metadata = {
  title: "Soft License Hub | Trusted Marketplace for Digital Products",
  description:
    "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price with instant delivery and warranty.",
  keywords: [
    "SoftLicenseHub",
    "Trusted Marketplace for Digital Products",
    "WhatsApp marketing tools",
    "AI subscriptions",
    "VPNs",
    "design tools",
    "digital products at best price",
    "software licenses bd",
    "canva pro subscription",
    "wa sender marketing suite",
    "genuine license keys",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soft License Hub | Trusted Marketplace for Digital Products",
    description:
      "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price.",
    url: "https://softlicensehub.com",
    siteName: "Soft License Hub",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Soft License Hub - Trusted Marketplace for Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soft License Hub | Trusted Marketplace for Digital Products",
    description:
      "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price.",
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
    console.error("Failed to fetch products on homepage:", error);
  }

  return [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <BannerSection />
      <CategorySection />
      <FeaturedProductsSection initialProducts={products} />
    </div>
  );
}
