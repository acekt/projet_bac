import React from 'react';
import Image from 'next/image';
import { Card } from './Card';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StoreCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  deliveryTime: string;
  categories: string[];
}

export const StoreCard = ({ id, name, image, location, rating, deliveryTime, categories }: StoreCardProps) => {
  return (
    <Link href={`/store/${id}`}>
      <Card className="group h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {rating}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white text-xs font-medium flex items-center gap-1">
              <MapPin size={12} />
              {location}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800">{name}</h3>
            <span className="text-brand-primary text-xs font-bold bg-brand-accent px-2 py-1 rounded-md">
              {deliveryTime}
            </span>
          </div>
          <p className="text-slate-500 text-sm line-clamp-1 mb-4">
            {categories.join(' • ')}
          </p>
          <div className="flex items-center text-brand-primary text-sm font-bold group-hover:gap-2 transition-all">
            Visiter le magasin <ArrowRight size={16} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
