"use client";

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import Link from 'next/link';
import { BackButton } from '@/components/common/BackButton';
import { PageWrapper } from '@/components/common/PageWrapper';

const FAVORITES = [
  { id: '1', storeId: 'mbolo', name: 'Riz Long Grain 5kg', price: 4500, category: 'Épicerie', unit: 'sac', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop' },
  { id: '2', storeId: 'mbolo', name: 'Lait Entier 1L', price: 850, category: 'Produits Frais', unit: 'brique', image: 'https://images.unsplash.com/photo-1550583724-125581dc228b?q=80&w=400&auto=format&fit=crop' },
  { id: '3', storeId: 'mbolo', name: 'Huile de Tournesol 1L', price: 1200, category: 'Épicerie', unit: 'bouteille', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbadb8c5?q=80&w=400&auto=format&fit=crop' },
];

export default function FavoritesPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-mesh bg-noise relative overflow-hidden py-12">
        {/* Visual background flares */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 space-y-8 relative z-10">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <h1 className="text-3xl font-black text-slate-800 dark:text-white">Mes Favoris</h1>
               <p className="text-slate-500 font-semibold">{FAVORITES.length} produits enregistrés</p>
             </div>
             <BackButton href="/" label="Retour" />
          </div>

          {FAVORITES.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center bg-white/40 dark:bg-slate-800/10 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
               <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                 <Heart size={48} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Aucun favori pour le moment</h2>
                 <p className="text-slate-500 max-w-sm font-medium">Ajoutez des produits en cliquant sur le coeur pour les retrouver facilement ici.</p>
               </div>
               <Link href="/">
                 <Button className="px-8 h-14 font-bold rounded-2xl shadow-xl shadow-brand-primary/25">Explorer les magasins</Button>
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
    </PageWrapper>
  );
}
