import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
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
    <Link href={`/store/${id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      <Card className="group h-full overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Star size={14} className="fill-accent text-accent" />
            <span className="text-foreground">{rating}</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-white/90 text-sm font-medium flex items-center gap-1.5">
              <MapPin size={16} className="text-primary" />
              {location}
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-xl font-bold text-foreground line-clamp-1">{name}</h3>
            <span className="text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
              {deliveryTime}
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-1 mb-5">
            {categories.join(' • ')}
          </p>
          <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
            Visiter le magasin <ArrowRight size={16} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
