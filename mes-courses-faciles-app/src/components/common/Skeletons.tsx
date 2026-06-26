import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white/40 dark:bg-slate-900/30 rounded-3xl overflow-hidden border border-slate-100/50 dark:border-white/5 animate-pulse flex flex-col p-0 h-full">
    <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-800/40 border-b border-slate-100/50 dark:border-white/5" />
    <div className="p-5 flex flex-col flex-grow space-y-3">
      <div className="h-3 w-20 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
      <div className="h-6 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
      <div className="flex items-end justify-between mt-auto pt-2">
        <div className="space-y-1">
          <div className="h-5 w-16 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          <div className="h-2 w-10 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
        </div>
        <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
      </div>
    </div>
  </div>
);

export const StoreSkeleton = () => (
  <div className="bg-white/40 dark:bg-slate-900/30 rounded-3xl overflow-hidden border border-border/50 animate-pulse flex flex-col p-0 h-full">
    <div className="h-36 w-full bg-slate-200/50 dark:bg-slate-800/40" />
    <div className="p-4 flex flex-col justify-between h-[136px]">
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
        <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
      </div>
      <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export const StoreGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <StoreSkeleton key={i} />
    ))}
  </div>
);

export const OrderListSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-6 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl animate-pulse flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
            <div className="h-5 w-20 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
          </div>
          <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
          <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          <div className="h-9 w-28 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const ProfileStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map((i) => (
      <div key={i} className="flex items-center gap-5 p-6 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-2xl animate-pulse">
        <div className="w-14 h-14 bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-1/3 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          <div className="h-8 w-1/2 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const DataTableSkeleton = () => (
  <div className="bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-3xl p-6 animate-pulse space-y-6">
    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
      <div className="h-8 w-44 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg" />
      <div className="h-10 w-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl" />
    </div>
    <div className="space-y-4">
      {/* Header Row */}
      <div className="grid grid-cols-4 gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
        ))}
      </div>
      {/* Data Rows */}
      {[1, 2, 3, 4, 5].map(row => (
        <div key={row} className="grid grid-cols-4 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
          {[1, 2, 3, 4].map(col => (
            <div key={col} className="h-5 bg-slate-200/30 dark:bg-slate-800/30 rounded" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SearchPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-pulse">
    {/* Search Input Area Skeleton */}
    <div className="h-14 w-full bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-3xl" />
    
    {/* Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Filter Skeleton */}
      <div className="hidden md:block md:col-span-1 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-[2rem] p-6 h-[450px] space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
            <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
          </div>
        ))}
      </div>
      
      {/* Product Grid Area */}
      <div className="md:col-span-3 space-y-6">
        <div className="flex justify-between items-center h-10 border-b border-border/40 pb-4">
          <div className="h-5 w-44 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  </div>
);

export const StoresPageSkeleton = () => (
  <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8 animate-pulse">
    {/* Page Title & Search area */}
    <div className="space-y-4">
      <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
      <div className="h-5 w-96 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
      <div className="h-12 w-full bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-3xl" />
    </div>

    {/* Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="hidden md:block md:col-span-1 bg-white/40 dark:bg-slate-900/30 border border-white/20 dark:border-white/5 rounded-[2rem] p-6 h-[300px] space-y-6">
        {[1, 2].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
            <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Stores Grid Area */}
      <div className="md:col-span-3 space-y-6">
        <div className="flex justify-between items-center h-10 border-b border-border/40 pb-4">
          <div className="h-5 w-36 bg-slate-200/50 dark:bg-slate-800/40 rounded-lg" />
          <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-800/40 rounded-full" />
        </div>
        <StoreGridSkeleton />
      </div>
    </div>
  </div>
);
