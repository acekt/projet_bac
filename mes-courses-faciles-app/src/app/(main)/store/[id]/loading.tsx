import React from 'react';
import { ProductSkeleton } from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-6 max-w-6xl space-y-8">
      {/* Navigation Row Skeleton */}
      <div className="flex justify-between items-center h-10 animate-pulse">
        <div className="w-24 h-8 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
        <div className="w-32 h-6 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
      </div>

      {/* Header Premium Card Skeleton */}
      <div className="bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl p-6 h-36 animate-pulse flex items-center gap-6">
        <div className="w-20 h-20 bg-slate-200/60 dark:bg-slate-800/50 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="w-1/3 h-6 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg" />
          <div className="w-2/3 h-4 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg" />
          <div className="w-1/2 h-4 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filter Card Skeleton */}
        <div className="hidden md:block md:col-span-1 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-[2rem] p-6 h-[400px] animate-pulse space-y-4">
          <div className="w-1/2 h-4 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg" />
          <div className="w-full h-10 bg-slate-200/60 dark:bg-slate-800/50 rounded-xl" />
          <div className="w-1/3 h-4 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg" />
          <div className="w-full h-10 bg-slate-200/60 dark:bg-slate-800/50 rounded-xl" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
