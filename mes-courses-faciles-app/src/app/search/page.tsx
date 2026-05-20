"use client";

import React, { useState } from 'react';
import { Search as SearchIcon, Filter, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { Card } from '@/components/ui/Card';

const RECENT_SEARCHES = ['Riz 5kg', 'Lait', 'Huile', 'Savon'];
const SUGGESTED_PRODUCTS = [
  { name: 'Riz Long Grain 5kg', price: 4500, category: 'Épicerie', unit: 'sac', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Lait Entier 1L', price: 850, category: 'Produits Frais', unit: 'brique', image: 'https://images.unsplash.com/photo-1550583724-125581dc228b?q=80&w=400&auto=format&fit=crop' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Search Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-slate-800">Rechercher</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Que cherchez-vous aujourd'hui ?"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-lg focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           <Button variant="outline" size="sm" className="rounded-full gap-2">
             <Filter size={16} /> Filtres
           </Button>
           {['Boutiques', 'Produits', 'Promotions'].map(cat => (
             <Button key={cat} variant="ghost" size="sm" className="rounded-full bg-white border border-slate-200">
               {cat}
             </Button>
           ))}
        </div>

        {!query ? (
          <div className="space-y-12">
            {/* Recent Searches */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recherches récentes</h2>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Catégories Populaires</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Épicerie', color: 'bg-orange-100 text-orange-600' },
                  { name: 'Produits Frais', color: 'bg-green-100 text-green-600' },
                  { name: 'Boissons', color: 'bg-blue-100 text-blue-600' },
                  { name: 'Hygiène', color: 'bg-purple-100 text-purple-600' },
                ].map(cat => (
                  <Card key={cat.name} className={`p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:scale-105 transition-transform ${cat.color}`}>
                     <span className="font-black">{cat.name}</span>
                     <ArrowRight size={16} />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-500">
              Résultats pour &quot;<span className="font-bold text-slate-800">{query}</span>&quot;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SUGGESTED_PRODUCTS.map((p, i) => (
                <ProductCard key={i} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
