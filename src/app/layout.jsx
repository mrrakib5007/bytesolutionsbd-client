import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import LayoutShell from "@/components/Shared/LayoutShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    template: "%s | Byte Solutions BD",
  },

  description:
    "Byte Solutions BD is the Trusted Marketplace for Digital Products. Buy genuine software licenses, WhatsApp marketing tools, Canva Pro, Windows 11 keys, Office 365, VPNs, and AI subscriptions with instant delivery.",

  applicationName: "Byte Solutions BD",

  keywords: [
    "Trusted Marketplace for Digital Products",
    "Marketplace for Digital Products",
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
    "software licenses",
    "genuine software keys",
    "software activation keys",
    "digital products marketplace",
    "international digital product services",
    "Canva Pro subscription",
    "Windows 11 Pro license key",
    "Office 365 subscription",
    "ChatGPT Plus subscription",
    "Claude Pro subscription",
    "WhatsApp marketing tools",
    "WhatsApp Sender Pro",
    "VPN subscriptions",
    "NordVPN ExpressVPN license",
    "Adobe Creative Cloud",
    "developer tools & licenses",
    "buy software online bangladesh",
    "instant license key delivery",
  ],

  authors: [{ name: "Byte Solutions BD" }],
  creator: "Byte Solutions BD",
  publisher: "Byte Solutions BD",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Byte Solutions BD",
    title: "Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "Your Trusted Marketplace for Digital Products. Genuine software licenses, WhatsApp marketing tools, Canva Pro, Windows keys, and AI subscriptions with instant delivery.",
    locale: "en_US",
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
      "Shop genuine software licenses, activation keys, marketing suites, and digital subscriptions on the Trusted Marketplace for Digital Products.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/byte-logo.png", type: "image/png" },
    ],
    apple: "/byte-logo.png",
    shortcut: "/byte-logo.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Byte Solutions BD",
  alternateName: ["ByteSolutionsBD", "Trusted Marketplace for Digital Products"],
  slogan: "Trusted Marketplace for Digital Products",
  url: siteUrl,
  logo: `${siteUrl}/byte-logo.png`,
  description:
    "Byte Solutions BD is the Trusted Marketplace for Digital Products, offering genuine software licenses, activation keys, digital tools, and subscriptions with instant delivery.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801991465007",
    contactType: "Customer Support",
    availableLanguage: ["English", "Bengali"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Byte Solutions BD",
  alternateName: ["ByteSolutionsBD", "Trusted Marketplace for Digital Products"],
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-(--primary)/5"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
