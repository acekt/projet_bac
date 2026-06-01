import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="aspect-square bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-100 rounded-full" />
      <div className="h-5 w-full bg-slate-100 rounded-lg" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-24 bg-slate-100 rounded-lg" />
        <div className="h-10 w-10 bg-slate-100 rounded-full" />
      </div>
    </div>
  </div>
);

export const StoreSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="h-48 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-6 w-3/4 bg-slate-100 rounded-lg" />
      <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
    </div>
  </div>
);
