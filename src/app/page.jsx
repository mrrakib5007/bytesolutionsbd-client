import BannerSection from "@/components/Home/BannerSection";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedProductsSection from "@/components/Home/FeaturedProductsSection";
import FloatingWhatsApp from "@/components/Home/FloatingWhatsApp";

export const metadata = {
  title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
  description:
    "Byte Solutions BD is your Trusted Marketplace for Digital Products. Buy genuine software licenses, WhatsApp marketing tools, Canva Pro, Windows 11 keys, Office 365, VPNs, and AI subscriptions with instant delivery and warranty.",
  keywords: [
    "Trusted Marketplace for Digital Products",
    "Marketplace for Digital Products",
    "Trusted Digital Products Marketplace",
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
    "WhatsApp marketing tools",
    "WhatsApp Sender Pro",
    "AI subscriptions",
    "ChatGPT Plus subscription",
    "Claude Pro subscription",
    "Canva Pro subscription",
    "Windows 11 Pro activation key",
    "Office 365 genuine license",
    "VPNs",
    "NordVPN",
    "ExpressVPN",
    "design tools",
    "digital products at best price",
    "software licenses bd",
    "genuine license keys",
    "international digital product services",
    "instant license delivery",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "Buy WhatsApp marketing tools, AI subscriptions, VPNs, Canva Pro, Windows keys, and genuine software licenses at Byte Solutions BD — the Trusted Marketplace for Digital Products.",
    url: "https://bytesolutionsbd.vercel.app",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Byte Solutions BD - Trusted Marketplace for Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "Your Trusted Marketplace for Digital Products. Genuine software licenses, activation keys, and subscriptions with instant delivery.",
    images: ["/og-image.png"],
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
