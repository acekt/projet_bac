"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from './skeleton';
import { ShoppingBag } from 'lucide-react';

export const ImageWithLoader = ({ src, alt, className = '' }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
      {!isLoaded && !hasError && <Skeleton className="absolute inset-0 z-10" />}
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-1 select-none p-2 text-center">
          <ShoppingBag size={24} className="opacity-60" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{alt.substring(0, 15)}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      )}
    </div>
  );
};
