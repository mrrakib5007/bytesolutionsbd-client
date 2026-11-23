import SignupForm from "../signup/SignupForm";

export const metadata = {
  title: "Sign Up | Byte Solutions BD",
  description:
    "Create an account on Byte Solutions BD to access genuine software licenses, instant downloads, and digital subscriptions on the Trusted Marketplace for Digital Products.",
  keywords: [
    "Byte Solutions BD register",
    "ByteSolutionsBD signup",
    "digital products marketplace",
    "Trusted Marketplace for Digital Products",
  ],
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterPage() {
  return <SignupForm />;
}
