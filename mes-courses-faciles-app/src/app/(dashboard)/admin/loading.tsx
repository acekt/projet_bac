import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Loading */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-5 w-72 rounded-lg" />
      </div>

      {/* Bento Grid KPIs Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-36 rounded-lg" />
            </div>
            {/* Sparkline Skeleton */}
            <Skeleton className="h-10 w-full rounded-xl" />
          </Card>
        ))}
      </div>

      {/* Bottom Sections Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Skeleton */}
        <Card className="lg:col-span-2 p-8 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Feed Skeleton */}
        <Card className="p-8 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] space-y-6">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
