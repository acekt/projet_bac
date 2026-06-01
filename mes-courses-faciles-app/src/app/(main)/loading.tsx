import React from 'react';
import { StoreSkeleton } from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      <div className="h-[500px] lg:h-[600px] bg-slate-200 animate-pulse" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <StoreSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
