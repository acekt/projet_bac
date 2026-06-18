"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import Link from 'next/link';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  return (
    <PageLayout withPadding>
      <div className="container mx-auto px-4 space-y-8">
        {/* En-tête standardisé */}
        <PageHeader
          title="Mes Favoris"
          subtitle={
            !isLoaded
              ? 'Chargement...'
              : `${favorites.length} produit${favorites.length > 1 ? 's' : ''} enregistré${favorites.length > 1 ? 's' : ''}`
          }
          backHref="/"
          backLabel="Accueil"
        />

        {/* Contenu */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-100/20 dark:bg-slate-800/20 animate-pulse border border-slate-200/50 dark:border-white/5" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center bg-white/40 dark:bg-slate-800/10 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Heart size={48} className="fill-red-500 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Aucun favori pour le moment</h2>
              <p className="text-slate-500 max-w-sm font-medium">Ajoutez des produits en cliquant sur le cœur pour les retrouver facilement ici.</p>
            </div>
            <Link href="/">
              <Button className="px-8 h-14 font-bold rounded-2xl shadow-xl shadow-brand-primary/25 cursor-pointer">
                Explorer les magasins
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {favorites.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
