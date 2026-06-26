import React from 'react';
import { ProfileStatsSkeleton } from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-8 py-12">
      {/* Back Button Skeleton */}
      <div className="flex justify-start">
        <div className="w-24 h-10 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl animate-pulse" />
      </div>

      {/* Premium Profile Header Card Skeleton */}
      <div className="bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl p-6 h-32 animate-pulse flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          <div className="w-20 h-20 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/3 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          </div>
        </div>
        <div className="w-36 h-11 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 h-14 bg-slate-200/20 dark:bg-slate-800/10 p-1 rounded-2xl">
          <div className="bg-white/60 dark:bg-slate-800/30 rounded-xl h-full" />
          <div className="h-full" />
        </div>

        {/* Stats Grid */}
        <ProfileStatsSkeleton />

        {/* Info Card Skeleton */}
        <div className="bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-3xl p-6 h-80 animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-44 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
            <div className="h-4 w-64 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
                <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
