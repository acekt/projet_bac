import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Loading */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-5 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded" />
          </Card>
        ))}
      </div>

      {/* Charts Loading Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] h-[450px] flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </Card>

        <Card className="p-8 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] h-[450px] flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded" />
            <Skeleton className="h-4 w-44 rounded" />
          </div>
          <div className="flex justify-center items-center h-[280px]">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}
