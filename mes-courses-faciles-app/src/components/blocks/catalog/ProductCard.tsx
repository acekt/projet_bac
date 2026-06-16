"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Plus, ShoppingCart, Package, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  storeId: string;
}

export const ProductCard = ({ id, name, price, image, category, unit, storeId }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFav = isFavorite(id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push(`?auth=login&callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    addToCart({ id, name, price, image, category, unit, storeId });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`?auth=login&callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    toggleFavorite({ id, name, price, image, category, unit, storeId });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="h-full transform-gpu"
    >
      <Card className={cn("group relative overflow-hidden transition-all duration-300 border-border/50 bg-card/45 backdrop-blur-md glass-card hover:shadow-glow hover:border-white/50 p-0 py-0 h-full flex flex-col transform-gpu")}>
        <div className="relative h-48 w-full bg-white dark:bg-slate-900/60 p-4 border-b border-slate-100/50 dark:border-white/5 overflow-hidden">
          <Link href={`/product/${id}`} className="absolute inset-0 block">
            {(!image || imgError) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                 <Package size={48} strokeWidth={1} />
                 <span className="text-[10px] font-bold uppercase tracking-tighter mt-2">Image indisponible</span>
              </div>
            ) : (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 transform-gpu"
                onError={() => setImgError(true)}
              />
            )}
          </Link>
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 h-10 w-10 bg-background/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all active:scale-90 z-10"
            aria-label="Ajouter aux favoris"
          >
            <Heart size={18} className={cn("transition-all duration-300", isFav ? "fill-red-500 text-red-500 scale-110" : "text-slate-500")} />
          </button>
          <button
            onClick={handleAdd}
            className={cn(
              "absolute top-3 right-3 h-10 w-10 rounded-full shadow-sm flex items-center justify-center transition-all active:scale-90 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 cursor-pointer",
              isAdded 
                ? "bg-emerald-500 text-white" 
                : "bg-background/80 backdrop-blur-md text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {isAdded ? (
              <Check size={20} strokeWidth={2.5} className="animate-scale-in text-white" />
            ) : (
              <Plus size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{category}</div>
          <h4 className="font-bold text-foreground line-clamp-2 leading-snug flex-grow min-h-[2.5rem] mb-4">
            <Link href={`/product/${id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </h4>

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-foreground">
                  {price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-muted-foreground mb-1">CFA</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">soit {price} CFA / {unit}</span>
            </div>
            <Button
              onClick={handleAdd}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shadow-sm hover:shadow transition-all hover:scale-105 active:scale-95 cursor-pointer",
                isAdded 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "bg-accent hover:bg-accent/90 text-accent-foreground"
              )}
              aria-label="Ajouter au panier"
            >
              {isAdded ? (
                <Check size={18} strokeWidth={2.5} className="animate-scale-in text-white" />
              ) : (
                <ShoppingCart size={18} />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
