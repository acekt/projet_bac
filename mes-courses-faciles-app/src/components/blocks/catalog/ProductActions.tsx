"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface ProductActionsProps {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string | null;
  images: string | null;
  storeId: string;
}

export function ProductActions({ id, name, price, category, unit, images, storeId }: ProductActionsProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      router.push(`?auth=login&callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const firstImage = (() => {
      try {
        const parsed = JSON.parse(images || '[]');
        return parsed[0] || '';
      } catch (e) {
        return images || '';
      }
    })();

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id,
        name,
        price,
        category,
        unit: unit || 'unité',
        image: firstImage,
        storeId,
      });
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="h-12 w-12 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-xl transition-all"
          aria-label="Diminuer la quantité"
        >
          <Minus size={20} />
        </button>
        <span className="w-12 text-center font-extrabold text-xl text-slate-800 dark:text-white">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="h-12 w-12 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-xl transition-all"
          aria-label="Augmenter la quantité"
        >
          <Plus size={20} />
        </button>
      </div>
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="flex-1 h-14 rounded-2xl shadow-xl shadow-brand-primary/30"
      >
        <ShoppingCart className="mr-2" size={24} />
        Ajouter au panier
      </Button>
    </div>
  );
}
