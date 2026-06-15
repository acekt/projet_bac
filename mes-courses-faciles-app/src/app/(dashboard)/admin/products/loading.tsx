import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      <div className="h-12 w-full sm:max-w-md bg-slate-250 dark:bg-slate-800 rounded-2xl" />
      <div className="h-[500px] w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm" />
    </div>
  );
}
