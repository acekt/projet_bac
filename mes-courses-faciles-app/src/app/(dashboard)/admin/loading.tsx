import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-slate-200 rounded-lg" />
        <div className="h-4 w-48 bg-slate-100 rounded-lg mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-white rounded-3xl border border-slate-100" />
        <div className="h-96 bg-white rounded-3xl border border-slate-100" />
      </div>
    </div>
  );
}
