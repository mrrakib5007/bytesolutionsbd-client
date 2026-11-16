export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 animate-pulse">
        {/* Header Row Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3">
          <div>
            <div className="h-3 w-32 bg-gray-200 rounded-md mb-2" />
            <div className="h-7 w-64 bg-gray-300 rounded-lg" />
          </div>
          <div className="h-9 w-full md:w-80 bg-gray-200 rounded-xl" />
        </div>

        {/* Controls Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-y border-gray-200/80 py-2.5 mb-6">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-12 bg-gray-300 rounded-lg" />
            <div className="h-7 w-28 bg-gray-200 rounded-lg" />
            <div className="h-7 w-32 bg-gray-200 rounded-lg" />
            <div className="h-7 w-24 bg-gray-200 rounded-lg" />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
            <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Product Cards Grid Skeleton (8 items) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs"
            >
              {/* Product Image Area */}
              <div className="aspect-4/3 w-full bg-slate-200" />

              {/* Product Info Area */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="h-3.5 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-12 bg-gray-100 rounded" />
                </div>
                <div className="h-5 w-4/5 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 rounded mb-1" />
                <div className="h-3 w-2/3 bg-gray-100 rounded mb-4" />

                {/* Price and Action Row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <div className="h-6 w-16 bg-gray-300 rounded mb-1" />
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                  </div>
                  <div className="h-9 w-24 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
