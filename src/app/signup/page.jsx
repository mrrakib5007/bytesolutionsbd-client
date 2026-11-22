import { Suspense } from "react";
import SignupForm from "./SignupForm";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Create Account - Byte Solutions BD",
  description:
    "Create an account on Byte Solutions BD to access genuine software licenses, instant downloads, and subscriptions.",
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
