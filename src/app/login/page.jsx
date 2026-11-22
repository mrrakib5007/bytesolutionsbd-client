import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Login - Byte Solutions BD",
  description:
    "Log in to your Byte Solutions BD account to manage your licenses, access digital downloads, and track purchases.",
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
