"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search as SearchIcon, X, ArrowRight,
  Apple, Sprout, CupSoda, Sparkles, Loader2
} from 'lucide-react';
import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { PageLayout } from '@/components/common/PageLayout';
import type { Product as ProductType } from '@/types';

const RECENT_SEARCHES = ['Riz 5kg', 'Lait', 'Huile', 'Savon'];

const CATEGORIES = [
  {
    name: 'Épicerie',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10',
    icon: Apple,
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-500/40',
  },
  {
    name: 'Produits Frais',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10',
    icon: Sprout,
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-500/40',
  },
  {
    name: 'Boissons',
    color: 'text-sky-600 dark:text-sky-400 bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10',
    icon: CupSoda,
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-500/40',
  },
  {
    name: 'Hygiène',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10',
    icon: Sparkles,
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-purple-500/40',
  },
];

interface SearchContentProps {
  /** RSC Discovery Board passé comme slot depuis le Server Component parent */
  discoverySlot: React.ReactNode;
}

function ResultBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
      {count} produit{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
    </span>
  );
}

export function SearchContent({ discoverySlot }: SearchContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };
    // Debounce 300ms
    const timer = setTimeout(fetchResults, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 130, damping: 16 } },
  };

  return (
    <PageLayout withPadding>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-5xl space-y-10"
      >
        {/* ── Search Header ── */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <span className="text-xs font-bold text-brand-safran bg-brand-safran/20 border border-brand-safran/20 px-4 py-1.5 rounded-full uppercase tracking-wider w-fit">
            Recherche Intelligente
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 dark:from-white dark:to-slate-300">
            Rechercher
          </h1>

          {/* Search Input */}
          <div className="relative glass-card rounded-3xl p-1.5 border-luminous hover:shadow-glow hover:border-white/50 focus-within:border-brand-primary/40 focus-within:shadow-glow transition-all duration-300 group">
            <SearchIcon
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-450 group-focus-within:text-brand-primary transition-colors"
              size={22}
            />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Que cherchez-vous aujourd'hui ?"
              className="w-full bg-transparent border-none py-4 pl-14 pr-12 text-lg focus:outline-none placeholder-slate-400 text-foreground font-semibold"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-foreground transition-all cursor-pointer active:scale-90"
                aria-label="Effacer la recherche"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Content zone (Discovery ou Résultats) ── */}
        <AnimatePresence mode="wait">
          {!query ? (
            /* ── DISCOVERY BOARD (empty state) ── */
            <motion.div
              key="discovery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-14"
            >
              {/* Recherches récentes */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Recherches récentes
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {RECENT_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-5 py-2.5 bg-white/40 dark:bg-slate-800/30 hover:bg-white/80 dark:hover:bg-slate-800/60 border border-white/30 dark:border-white/15 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand-primary hover:text-brand-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catégories populaires */}
              <div className="space-y-5">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Catégories populaires
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <div
                        key={cat.name}
                        onClick={() => setQuery(cat.name)}
                        className={`group p-6 flex flex-col items-center justify-center text-center cursor-pointer rounded-[1.5rem] border backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 ${cat.color} ${cat.hoverGlow}`}
                      >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-background border border-current/10 shadow-inner mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <IconComponent size={26} className="stroke-[2.5]" />
                        </div>
                        <span className="font-black text-sm tracking-tight text-foreground block">
                          {cat.name}
                        </span>
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider group-hover:text-primary flex items-center gap-1 transition-colors mt-1">
                          Explorer <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Discovery Board (RSC slot) ─────────────────────────── */}
              {/* Ce slot contient TrendingProducts + PopularStores.        */}
              {/* Rendu serveur, streamé — zéro fetch côté client.          */}
              <div className="space-y-1">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-10" />
                {discoverySlot}
              </div>
            </motion.div>
          ) : (
            /* ── RÉSULTATS ── */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <p className="text-slate-500 font-medium">
                  Résultats pour &quot;<span className="font-bold text-slate-800 dark:text-white">{query}</span>&quot;
                </p>
                {!loading && <ResultBadge count={results.length} />}
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-72 bg-white/40 dark:bg-slate-800/30 border border-white/20 animate-pulse rounded-3xl flex items-center justify-center"
                    >
                      <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {results.map((p) => {
                    let imgUrl = '/images/product-placeholder.svg';
                    try {
                      const imgs = JSON.parse(p.images || '[]');
                      if (imgs.length > 0) imgUrl = imgs[0];
                    } catch {}

                    return (
                      <ProductCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={p.price}
                        category={p.category}
                        unit={p.unit || 'unité'}
                        storeId={p.storeId}
                        image={imgUrl}
                      />
                    );
                  })}
                </div>
              ) : (
                /* ── Empty State de recherche ── */
                <Card className="p-16 text-center border-border/50 border-dashed rounded-3xl bg-white/40 dark:bg-slate-800/10 backdrop-blur-md">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground shadow-sm">
                    <SearchIcon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">Aucun résultat</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Aucun article ne correspond à &quot;<strong>{query}</strong>&quot;. Essayez un autre mot-clé ou parcourez nos magasins partenaires.
                  </p>
                  <button
                    onClick={() => setQuery('')}
                    className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md shadow-brand-primary/25 hover:bg-brand-primary/90 active:scale-95 transition-all cursor-pointer"
                  >
                    Retour au Discovery Board
                  </button>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
}
