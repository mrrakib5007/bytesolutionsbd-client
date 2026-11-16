import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Panel - Soft License Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ParamountLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
