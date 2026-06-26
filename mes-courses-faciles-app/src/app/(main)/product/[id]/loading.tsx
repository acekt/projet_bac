import React from 'react';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button Skeleton */}
      <div className="mb-8 w-44 h-10 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery Image Skeleton */}
        <div className="aspect-square bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-[2.5rem] animate-pulse p-4">
          <div className="w-full h-full bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl" />
        </div>

        {/* Info Skeleton */}
        <div className="space-y-8 py-4 animate-pulse">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
              <div className="h-4 w-4 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
              <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
            </div>
            <div className="h-12 w-3/4 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
            <div className="h-10 w-44 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          </div>

          <div className="h-24 w-full bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl p-4 space-y-3">
            <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
            <div className="h-4 w-5/6 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-6 w-1/2 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
            <div className="h-6 w-1/2 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/5" />

          {/* Actions Skeletons */}
          <div className="space-y-4">
            <div className="h-14 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
