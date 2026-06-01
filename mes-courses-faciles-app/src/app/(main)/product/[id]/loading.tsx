import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-slate-100 rounded-[2.5rem] animate-pulse" />
          <div className="space-y-8 py-4">
            <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-12 w-3/4 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-32 w-full bg-slate-50 rounded-2xl animate-pulse" />
            <div className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
