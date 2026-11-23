import BannerSection from "@/components/Home/BannerSection";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedProductsSection from "@/components/Home/FeaturedProductsSection";
import FloatingWhatsApp from "@/components/Home/FloatingWhatsApp";

export const metadata = {
  title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
  description:
    "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price with instant delivery and warranty at Byte Solutions BD.",
  keywords: [
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
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
    title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price with Byte Solutions BD.",
    url: "https://bytesolutionsbd.vercel.app",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/byte-logo.png",
        width: 1254,
        height: 1254,
        alt: "Byte Solutions BD - Trusted Marketplace for Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "WhatsApp marketing tools, AI subscriptions, VPNs, design tools and more, all digital products in one place at the best price with Byte Solutions BD.",
    images: ["/byte-logo.png"],
  },
};

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
      <FloatingWhatsApp />
    </div>
  );
}
