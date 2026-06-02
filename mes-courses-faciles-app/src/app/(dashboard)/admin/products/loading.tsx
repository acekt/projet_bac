import React from 'react';

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-48 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-[500px] w-full bg-white rounded-3xl border border-slate-100" />
    </div>
  );
}
