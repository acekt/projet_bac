"use client";

import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

export const ImageWithLoader = ({ src, alt, className = '' }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};
