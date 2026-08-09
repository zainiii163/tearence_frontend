import React from 'react';

/** Lightweight Suspense fallback — avoids full SkeletonPage on every hub navigation. */
export default function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-slate-50">
      <div
        className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}
