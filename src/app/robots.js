export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/paramount/", "/dashboard/", "/checkout/"],
      },
    ],
    sitemap: "https://bytesolutionsbd.com/sitemap.xml",
  };
}
