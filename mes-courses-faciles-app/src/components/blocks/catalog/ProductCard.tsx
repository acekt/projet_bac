import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Plus, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

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
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image, category, unit, storeId });
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card">
      <div className="relative h-48 w-full bg-muted/30 p-6 overflow-hidden">
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
            className="object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        )}
        <button
          onClick={handleAdd}
          className="absolute top-3 right-3 h-10 w-10 bg-background/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all active:scale-90 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="p-5 flex flex-col h-full">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{category}</div>
        <h4 className="font-bold text-foreground line-clamp-2 leading-snug flex-grow min-h-[2.5rem] mb-4">{name}</h4>

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
            className="h-10 w-10 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm hover:shadow transition-all hover:scale-105 active:scale-95"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
