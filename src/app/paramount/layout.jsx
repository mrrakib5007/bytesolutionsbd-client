import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Panel - Byte Solutions BD",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ParamountLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
