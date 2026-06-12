"use client";

import React, { useState, use, useEffect } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronRight, LayoutGrid, List, SlidersHorizontal, Loader2, PackageX } from 'lucide-react';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Product as ProductType } from '@/types';
import { ProductSkeleton } from '@/components/common/Skeletons';
import { BackButton } from '@/components/common/BackButton';


const CATEGORIES = [
  'Tous', 'Alimentaire', 'Nettoyage', 'Hygiène', 'Bébé', 'Boissons'
];

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?storeId=${resolvedParams.id}`;
        if (activeCategory !== 'Tous') {
          url += `&category=${activeCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [resolvedParams.id, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-mesh bg-noise relative overflow-hidden">
      {/* Background visual flares */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none" />

      <PageWrapper>
      <div className="flex-grow relative z-10">
        {/* Store Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 sticky top-16 md:top-20 z-30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <BackButton href="/" label="Retour" className="hidden sm:inline-flex" />
                <BackButton href="/" label="" className="sm:hidden h-10 w-10 p-0 flex items-center justify-center rounded-full" />
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden relative">
                <Image
                   src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=100&auto=format&fit=crop"
                   alt="Store logo"
                   fill
                   className="object-cover"
                />
              </div>
              <div>
                <nav className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <span>Magasins</span>
                  <ChevronRight size={12} />
                  <span className="font-bold text-brand-primary uppercase">{resolvedParams.id}</span>
                </nav>
                <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{resolvedParams.id.replace('-', ' ')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Chercher dans ce magasin..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
               </div>
               <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl md:hidden">
                 <SlidersHorizontal size={18} />
               </Button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="container mx-auto px-4 border-t border-slate-200/40 dark:border-white/5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2.5 py-3.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm
                  ${activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 border-transparent'
                    : 'bg-white/40 dark:bg-slate-800/30 backdrop-blur-sm text-slate-650 dark:text-slate-300 border border-slate-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
            <div className="glass-card rounded-[2rem] p-6 border-luminous shadow-sm space-y-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Filter size={18} /> Filtres
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 block">Prix</label>
                <input type="range" className="w-full h-2 bg-slate-200/50 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>0 CFA</span>
                  <span>50.000 CFA</span>
                </div>
              </div>
              <div className="h-px bg-slate-200/50 dark:bg-white/5" />
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 block">Disponibilité</label>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="rounded text-brand-primary border-slate-350 dark:border-white/10" />
                  <span>En stock</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="rounded text-brand-primary border-slate-350 dark:border-white/10" />
                  <span>Promotions</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-sm font-medium">
                <span className="text-slate-800 font-bold">{products.length}</span> produits trouvés
              </p>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1.5 rounded bg-slate-100 text-brand-primary"><LayoutGrid size={18} /></button>
                <button className="p-1.5 rounded text-slate-400 hover:bg-slate-50"><List size={18} /></button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-[2.5rem] border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <PackageX size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800">Aucun produit trouvé</h3>
                  <p className="text-slate-500">Essayez de changer de catégorie ou de filtre.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveCategory('Tous')}>
                  Voir tous les produits
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    unit={product.unit || 'unité'}
                    storeId={product.storeId}
                    image={(() => {
                      try {
                        const imgs = JSON.parse(product.images || '[]');
                        return imgs[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop';
                      } catch(e) {
                        return product.images || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop';
                      }
                    })()}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center pt-8 pb-12">
              <Button variant="outline" className="px-12 border-slate-300">
                Charger plus de produits
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
    </PageWrapper>
    </div>
  );
}
