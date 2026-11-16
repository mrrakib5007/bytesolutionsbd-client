export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-(--primary)" />
        <span className="text-xs font-semibold text-gray-500 animate-pulse">
          Loading Soft License Hub...
        </span>
      </div>
    </div>
  );
}
