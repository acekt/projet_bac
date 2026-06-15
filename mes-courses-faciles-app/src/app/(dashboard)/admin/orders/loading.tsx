import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      {/* Search Input Skeleton */}
      <div className="h-12 w-full sm:max-w-md bg-slate-250 dark:bg-slate-800 rounded-2xl" />

      {/* Table Card Skeleton */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-850 flex gap-4">
          <div className="h-4 w-1/6 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="h-4 w-1/6 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="h-4 w-1/6 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="h-4 w-1/12 bg-slate-200 dark:bg-slate-850 rounded ml-auto" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-5 flex items-center gap-4">
              <div className="h-4 w-1/6 bg-slate-150 dark:bg-slate-800 rounded font-mono" />
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-slate-150 dark:bg-slate-850 rounded" />
                </div>
              </div>
              <div className="h-4 w-1/6 bg-slate-150 dark:bg-slate-800 rounded font-bold" />
              <div className="h-4 w-1/6 bg-slate-150 dark:bg-slate-800 rounded" />
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
