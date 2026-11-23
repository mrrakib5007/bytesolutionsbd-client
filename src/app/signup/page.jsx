import { Suspense } from "react";
import SignupForm from "./SignupForm";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Create Account | Join Byte Solutions BD",
  description:
    "Sign up for a free Byte Solutions BD account. Discover genuine software licenses, marketing tools, VPNs, and AI subscriptions with instant delivery on the Trusted Marketplace for Digital Products.",
  keywords: [
    "Byte Solutions BD signup",
    "create account Byte Solutions BD",
    "buy software licenses bangladesh",
    "digital products registration",
    "software license marketplace",
    "Trusted Marketplace for Digital Products",
  ],
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Join Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "Create an account today to purchase genuine software licenses with instant delivery and guaranteed warranty.",
    url: "https://bytesolutionsbd.vercel.app/signup",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Byte Solutions BD - Create Account",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Account - Byte Solutions BD",
    description:
      "Join the Trusted Marketplace for Digital Products. Get instant license keys and premium support.",
    images: ["/og-image.png"],
  },
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading text="Loading signup..." />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
