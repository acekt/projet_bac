"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, ArrowRight, Apple, Sprout, CupSoda, Sparkles, Loader2 } from 'lucide-react';

import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Product as ProductType } from '@/types';

const RECENT_SEARCHES = ['Riz 5kg', 'Lait', 'Huile', 'Savon'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/products?q=${query}`);
          const data = await res.json();
          setResults(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-mesh bg-noise py-12 relative overflow-hidden">
      {/* Visual background flares for Spatial UI depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-5xl space-y-10 relative z-10"
      >
        {/* Search Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <span className="text-xs font-bold text-brand-safran bg-brand-safran/20 border border-brand-safran/20 px-4 py-1.5 rounded-full uppercase tracking-wider w-fit">
            Recherche Intelligente
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 dark:from-white dark:to-slate-350">
            Rechercher
          </h1>
          
          <div className="relative glass-card rounded-3xl p-1.5 border-luminous hover:shadow-glow hover:border-white/50 focus-within:border-brand-primary/40 focus-within:shadow-glow transition-all duration-300 group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-450 group-focus-within:text-brand-primary transition-colors" size={22} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Que cherchez-vous aujourd'hui ?"
              className="w-full bg-transparent border-none py-4.5 pl-14 pr-12 text-lg focus:outline-none placeholder-slate-400 text-foreground font-semibold"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-foreground transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>



        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div 
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Recent Searches */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recherches récentes</h2>
                <div className="flex flex-wrap gap-2.5">
                  {RECENT_SEARCHES.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setQuery(s)} 
                      className="px-5 py-3 bg-white/40 dark:bg-slate-800/30 hover:bg-white/80 dark:hover:bg-slate-800/60 border border-white/30 dark:border-white/15 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-350 hover:border-brand-primary hover:text-brand-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="space-y-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Catégories Populaires</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Épicerie', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10', icon: Apple, hoverGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-500/40' },
                    { name: 'Produits Frais', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10', icon: Sprout, hoverGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-500/40' },
                    { name: 'Boissons', color: 'text-sky-600 dark:text-sky-400 bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10', icon: CupSoda, hoverGlow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-500/40' },
                    { name: 'Hygiène', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10', icon: Sparkles, hoverGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-purple-500/40' },
                  ].map(cat => {
                    const IconComponent = cat.icon;
                    return (
                      <div
                        key={cat.name}
                        onClick={() => setQuery(cat.name)}
                        className={`group p-8 flex flex-col items-center justify-between text-center cursor-pointer rounded-[2rem] border backdrop-blur-md shadow-sm transition-all duration-500 hover:scale-105 active:scale-95 ${cat.color} ${cat.hoverGlow}`}
                      >
                         <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-background border border-current/10 shadow-inner mb-4 group-hover:scale-115 group-hover:rotate-6 transition-all duration-350">
                            <IconComponent size={28} className="stroke-[2.5]" />
                         </div>
                         <div className="space-y-1">
                            <span className="font-black text-base tracking-tight text-foreground block">{cat.name}</span>
                            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider group-hover:text-primary flex items-center justify-center gap-1 transition-colors">
                              Explorer <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <p className="text-slate-500 font-medium">
                  Résultats pour &quot;<span className="font-bold text-slate-800 dark:text-white">{query}</span>&quot;
                </p>
                <Badge className="px-3 py-1 font-bold rounded-full">
                  {results.length} produit{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </Badge>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-72 bg-white/40 dark:bg-slate-800/30 border border-white/20 animate-pulse rounded-3xl flex items-center justify-center">
                       <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {results.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      category={p.category}
                      unit={p.unit || 'unité'}
                      storeId={p.storeId}
                      image={(() => {
                        try {
                          const imgs = JSON.parse(p.images || '[]');
                          return imgs[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop';
                        } catch(e) {
                          return p.images || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop';
                        }
                      })()}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-16 text-center border-border/50 border-dashed rounded-3xl bg-white/40 dark:bg-slate-800/10 backdrop-blur-md">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground shadow-sm">
                    <SearchIcon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">Aucun résultat</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">Nous n&apos;avons trouvé aucun article correspondant à &quot;{query}&quot;. Essayez un autre mot-clé ou parcourez nos magasins partenaires.</p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Badge Component Helper
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 ${className}`}>
      {children}
    </span>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mesh bg-noise py-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
