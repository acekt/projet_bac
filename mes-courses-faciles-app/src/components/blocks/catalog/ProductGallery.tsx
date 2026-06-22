"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { resolveImageUrl } from '@/lib/image-resolver';

interface ProductGalleryProps {
  imagesString: string | null;
  name: string;
}

export function ProductGallery({ imagesString, name }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Résolution centralisée via resolveImageUrl (gère JSON, null, chemin local, URL distante)
  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(imagesString || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((img: unknown) => resolveImageUrl(String(img), 'product'));
      }
    } catch {
      // pas du JSON — on traite comme chemin brut
    }
    // chaîne brute non-JSON ou null
    return [resolveImageUrl(imagesString, 'product')];
  })();

  const activeImage = images[activeImageIndex] ?? images[0];

  return (
    <div className="space-y-6">
      {/* Main Image View */}
      <div className="relative aspect-square bg-white/40 dark:bg-slate-800/30 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/30 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
        <ImageWithLoader
          src={activeImage}
          alt={name}
          type="product"
          objectFit="contain"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute inset-0"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`absolute top-6 right-6 h-12 w-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center justify-center transition-colors z-10 ${
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
              className={`relative aspect-square rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border-2 transition-all cursor-pointer ${
                i === activeImageIndex ? 'border-brand-primary' : 'border-transparent hover:border-white/50'
              }`}
            >
              <ImageWithLoader
                src={img}
                alt=""
                type="product"
                objectFit="contain"
                sizes="100px"
                className="absolute inset-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
