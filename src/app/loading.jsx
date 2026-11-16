import Loading from "@/components/Loading";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50">
      <Loading text="Loading..." className="py-20" />
    </div>
  );
}
