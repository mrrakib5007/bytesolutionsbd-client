import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Panel - Byte Solutions BD",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function ParamountLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
