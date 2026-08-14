import React from 'react';

/** Soft Suspense fallback — thin progress bar + fade, not a heavy skeleton. */
export default function RouteFallback() {
  return (
    <div
      className="relative min-h-[45vh] bg-slate-50/80 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-emerald-100">
        <div className="h-full w-1/3 rounded-full bg-emerald-500 wwa-route-progress" />
      </div>
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 px-4">
        <div className="h-7 w-7 rounded-full border-2 border-emerald-600/80 border-t-transparent animate-spin" />
        <p className="text-xs font-medium text-slate-500 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
