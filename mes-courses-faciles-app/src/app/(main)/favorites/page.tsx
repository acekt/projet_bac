"use client";

import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';

const FAVORITES = [
  { id: '1', storeId: 'mbolo', name: 'Riz Long Grain 5kg', price: 4500, category: 'Épicerie', unit: 'sac', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop' },
  { id: '2', storeId: 'mbolo', name: 'Lait Entier 1L', price: 850, category: 'Produits Frais', unit: 'brique', image: 'https://images.unsplash.com/photo-1550583724-125581dc228b?q=80&w=400&auto=format&fit=crop' },
  { id: '3', storeId: 'mbolo', name: 'Huile de Tournesol 1L', price: 1200, category: 'Épicerie', unit: 'bouteille', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbadb8c5?q=80&w=400&auto=format&fit=crop' },
];

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h1 className="text-3xl font-black text-slate-800">Mes Favoris</h1>
             <p className="text-slate-500">{FAVORITES.length} produits enregistrés</p>
           </div>
           <Link href="/">
             <Button variant="ghost" className="gap-2 font-bold text-slate-500">
               <ArrowLeft size={20} /> Retour
             </Button>
           </Link>
        </div>

        {FAVORITES.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
             <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
               <Heart size={48} />
             </div>
             <div className="space-y-2">
               <h2 className="text-2xl font-bold text-slate-800">Aucun favori pour le moment</h2>
               <p className="text-slate-500 max-w-sm">Ajoutez des produits en cliquant sur le coeur pour les retrouver facilement ici.</p>
             </div>
             <Link href="/">
               <Button className="px-8 h-14 font-bold">Explorer les magasins</Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FAVORITES.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
