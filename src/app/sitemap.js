const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bytesolutionsbd.vercel.app";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function sitemap() {
  let productEntries = [];
  let downloadEntries = [];

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data) ? data : data?.products || data?.data || [];
      productEntries = products.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // If backend isn't reachable during build/request, proceed gracefully
  }

  try {
    const res = await fetch(`${API_BASE_URL}/downloads`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const downloads = Array.isArray(data) ? data : data?.downloads || data?.data || [];
      downloadEntries = downloads.map((item) => ({
        url: `${SITE_URL}/downloads/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // Graceful fallback
  }

  const staticEntries = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/downloads`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  return [...staticEntries, ...productEntries, ...downloadEntries];
}
