"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface ProductGalleryProps {
  imagesString: string | null;
  name: string;
}

export function ProductGallery({ imagesString, name }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(imagesString || '[]');
      return parsed.length > 0 ? parsed : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop'];
    } catch(e) {
      return imagesString ? [imagesString] : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop'];
    }
  })();

  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="space-y-6">
      {/* Main Image View */}
      <div className="relative aspect-square bg-white/40 dark:bg-slate-800/30 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/30 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-12"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`absolute top-6 right-6 h-12 w-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            isFavorited ? 'text-red-500 bg-red-50 dark:bg-red-950/35' : 'text-slate-400 hover:text-red-500'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart size={24} className={isFavorited ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Thumbnail Selector Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveImageIndex(i)}
              className={`relative aspect-square rounded-2xl bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border-2 transition-all cursor-pointer ${
                i === activeImageIndex ? 'border-brand-primary' : 'border-transparent hover:border-white/50'
              }`}
            >
              <Image src={img} alt="" fill sizes="100px" className="object-contain p-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
