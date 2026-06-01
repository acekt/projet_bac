import React from 'react';
import { ProductSkeleton } from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-16 w-full bg-white rounded-2xl border border-slate-100 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
