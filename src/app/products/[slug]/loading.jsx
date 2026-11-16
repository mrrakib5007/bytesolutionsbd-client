export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-300 rounded" />
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Image Skeleton */}
          <div className="lg:col-span-6">
            <div className="aspect-4/3 w-full rounded-3xl bg-slate-200 shadow-xs" />

            {/* Quick Guarantees Skeleton */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-3.5 text-center shadow-xs"
                >
                  <div className="h-5 w-5 bg-gray-200 rounded-full mb-1.5" />
                  <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
                  <div className="h-2.5 w-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions Skeleton */}
          <div className="flex flex-col lg:col-span-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-9 w-4/5 bg-gray-300 rounded-lg mb-2" />
            <div className="h-9 w-2/3 bg-gray-300 rounded-lg mb-4" />

            {/* Rating Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-24 bg-amber-100 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 mb-6">
              <div className="h-3.5 w-full bg-gray-200 rounded" />
              <div className="h-3.5 w-5/6 bg-gray-200 rounded" />
              <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
            </div>

            {/* Price Box Skeleton */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 mb-6 shadow-xs">
              <div className="flex items-baseline gap-3 mb-2">
                <div className="h-9 w-24 bg-gray-300 rounded-lg" />
                <div className="h-5 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-14 bg-rose-100 rounded" />
              </div>
              <div className="h-3 w-40 bg-gray-200 rounded" />
            </div>

            {/* Duration Selector Skeleton */}
            <div className="mb-6">
              <div className="h-3.5 w-28 bg-gray-200 rounded mb-2.5" />
              <div className="flex flex-wrap gap-2.5">
                <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                <div className="h-10 w-24 bg-gray-200 rounded-xl" />
              </div>
            </div>

            {/* Feature Checkmarks Skeleton */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 mb-8 space-y-3 shadow-xs">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-emerald-100 shrink-0" />
                  <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-12 flex-1 bg-gray-300 rounded-xl" />
              <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
