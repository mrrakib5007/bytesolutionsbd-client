import BannerSection from "@/components/Home/BannerSection";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedProductsSection from "@/components/Home/FeaturedProductsSection";

export const metadata = {
  title: "Soft License Hub | Genuine Software Licenses, Keys & Subscriptions",
  description:
    "Buy 100% genuine software licenses, productivity tools, marketing suites, and cloud subscriptions at the best prices with instant delivery and dedicated support in Bangladesh.",
  keywords: [
    "SoftLicenseHub",
    "software licenses",
    "buy software licenses bd",
    "genuine activation keys",
    "digital subscriptions",
    "marketing software",
    "design tools",
    "canva pro",
    "wa sender",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soft License Hub | Genuine Software Licenses & Digital Tools",
    description:
      "Explore verified software licenses, productivity suites, marketing tools, and subscriptions with instant digital delivery and 100% guarantee.",
    url: "https://softlicensehub.com",
    siteName: "Soft License Hub",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Soft License Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soft License Hub | Genuine Software Licenses & Digital Tools",
    description:
      "Explore verified software licenses, productivity suites, and subscriptions with instant digital delivery.",
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
