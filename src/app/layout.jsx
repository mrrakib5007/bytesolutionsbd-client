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
    default: "Byte Solutions BD | Software Licenses & Digital Products",
    template: "%s | Byte Solutions BD",
  },

  description:
    "Discover software licenses, activation keys, digital subscriptions, and premium digital products at Byte Solutions BD. Shop digital products with ease.",

  applicationName: "Byte Solutions BD",

  keywords: [
    "Byte Solutions BD",
    "ByteSolutionsBD",
    "Byte Solutions",
    "software licenses",
    "software activation keys",
    "digital products",
    "genuine software keys",
    "digital subscriptions",
    "premium digital products",
    "buy software online bangladesh",
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
    title: "Byte Solutions BD | Software Licenses & Digital Products",
    description:
      "Explore software licenses, activation keys, subscriptions, and digital products at Byte Solutions BD.",
    locale: "en_US",
    images: [
      {
        url: "/byte-logo.png",
        width: 1254,
        height: 1254,
        alt: "Byte Solutions BD Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Byte Solutions BD | Software Licenses & Digital Products",
    description:
      "Shop software licenses, activation keys, subscriptions, and digital products at Byte Solutions BD.",
    images: ["/byte-logo.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Byte Solutions BD",
  alternateName: "ByteSolutionsBD",
  url: siteUrl,
  logo: `${siteUrl}/byte-logo.png`,
  description:
    "Discover software licenses, activation keys, digital subscriptions, and premium digital products at Byte Solutions BD.",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
