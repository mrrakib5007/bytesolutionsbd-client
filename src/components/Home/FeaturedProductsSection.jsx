"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/Shared/SectionHeading";
import ProductCard from "@/components/Cards/Productcard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function FeaturedProductsSection({ initialProducts = [] }) {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts.length > 0) return;

    let isMounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setFetchedProducts(data);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load featured products from API:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [initialProducts.length]);

  const products =
    initialProducts.length > 0 ? initialProducts : fetchedProducts;

  // Featured products: Top-rated products, max 8 (4 per row in 2 rows)
  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        const reviewsA = Number(a.reviewsCount) || 0;
        const reviewsB = Number(b.reviewsCount) || 0;
        return reviewsB - reviewsA;
      })
      .slice(0, 8);
  }, [products]);

  // Show "More Products" button if there are more than 8 products
  const hasMore = products.length > 8;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Featured Products"
          title="Top Rated Software & Tools"
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 w-full animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id || product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
            No featured products available at the moment.
          </div>
        )}

        {hasMore && !loading && (
          <div className="mt-10 flex justify-center sm:mt-12 lg:mt-14">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 shadow-xs transition-all duration-200 hover:border-(--primary) hover:text-(--primary) hover:shadow-md active:scale-95 sm:text-base cursor-pointer"
            >
              <span>More Products</span>
              <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
