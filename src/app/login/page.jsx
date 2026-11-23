import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Login | Customer Portal - Byte Solutions BD",
  description:
    "Log in to your Byte Solutions BD account to view your purchased software licenses, manage digital tool subscriptions, and track orders on the Trusted Marketplace for Digital Products.",
  keywords: [
    "Byte Solutions BD login",
    "ByteSolutionsBD account",
    "software license portal",
    "digital products account",
    "access digital subscriptions",
    "Trusted Marketplace for Digital Products",
  ],
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Login to Byte Solutions BD | Trusted Marketplace for Digital Products",
    description:
      "Access your verified software licenses, keys, and subscriptions on Byte Solutions BD.",
    url: "https://bytesolutionsbd.vercel.app/login",
    siteName: "Byte Solutions BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Byte Solutions BD - Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login to Byte Solutions BD",
    description: "Manage your software licenses and subscriptions.",
    images: ["/og-image.png"],
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading text="Loading login..." />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
