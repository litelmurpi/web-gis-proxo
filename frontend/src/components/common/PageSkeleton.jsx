import Skeleton from "./Skeleton";

/**
 * Full-page skeleton loader shown while lazy-loaded routes are being fetched.
 * Mimics a dashboard layout with shimmer effects.
 */
export default function PageSkeleton() {
  return (
    <div className="h-full w-full bg-base-950 p-6 lg:p-10 animate-in fade-in duration-300">
      {/* Header shimmer */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* KPI Cards shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>

      {/* Chart area shimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
