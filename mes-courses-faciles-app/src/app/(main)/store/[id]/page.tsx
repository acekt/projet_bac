import React from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/blocks/catalog/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, PackageX, Phone, MapPin } from 'lucide-react';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const CATEGORIES = [
  'Tous', 'Alimentaire', 'Nettoyage', 'Hygiène', 'Bébé', 'Boissons'
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
    select: { name: true, description: true, isActive: true, isDeleted: true }
  });
  return {
    title: store && store.isActive && !store.isDeleted ? `${store.name} | MesAchats241` : 'Magasin | MesAchats241',
    description: store?.description || 'Découvrez nos magasins partenaires sur MesAchats241.',
  };
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const activeCategory = resolvedSearchParams.category || 'Tous';
  const query = resolvedSearchParams.q || '';

  // Get Store from DB
  const store = await prisma.store.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!store || !store.isActive || store.isDeleted) {
    notFound();
  }

  const storeName = store.name;
  const storeLogo = store.logo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=100&auto=format&fit=crop";

  // Get Products from DB
  const products = await prisma.product.findMany({
    where: {
      storeId: resolvedParams.id,
      isActive: true,
      isDeleted: false,
      ...(activeCategory !== 'Tous' && { category: activeCategory }),
      ...(query && {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ]
      })
    },
    include: {
      store: {
        select: {
          name: true,
        }
      }
    }
  });

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
                     src={storeLogo}
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
                  <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white capitalize">{storeName}</h1>
                  {store.description && (
                    <p className="text-sm text-slate-550 dark:text-slate-400 mt-1 max-w-xl font-semibold leading-snug">{store.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-brand-primary" />
                      {store.district}, Libreville ({store.address})
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-brand-safran" />
                      Tél : {store.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <form action="" method="GET" className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="q"
                      defaultValue={query}
                      placeholder="Chercher dans ce magasin..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none text-slate-800 dark:text-white"
                    />
                    {activeCategory !== 'Tous' && <input type="hidden" name="category" value={activeCategory} />}
                 </form>
              </div>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="container mx-auto px-4 border-t border-slate-200/40 dark:border-white/5 overflow-x-auto no-scrollbar">
            <div className="flex gap-2.5 py-3.5">
              {CATEGORIES.map((cat) => {
                const searchParamsString = new URLSearchParams();
                if (cat !== 'Tous') {
                  searchParamsString.set('category', cat);
                }
                if (query) {
                  searchParamsString.set('q', query);
                }
                const queryString = searchParamsString.toString();
                const linkUrl = `/store/${resolvedParams.id}${queryString ? `?${queryString}` : ''}`;

                return (
                  <Link
                    key={cat}
                    href={linkUrl}
                    className={`
                      px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm
                      ${activeCategory === cat
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 border-transparent'
                        : 'bg-white/40 dark:bg-slate-800/30 backdrop-blur-sm text-slate-655 dark:text-slate-350 border border-slate-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                    `}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Grid */}
            <main className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm font-medium">
                  <span className="text-slate-850 dark:text-white font-bold">{products.length}</span> produits trouvés
                </p>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white dark:bg-slate-800/10 backdrop-blur-md rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <PackageX size={40} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Aucun produit trouvé</h3>
                    <p className="text-slate-500">Essayez de changer de catégorie ou de filtre.</p>
                  </div>
                  <Link href={`/store/${resolvedParams.id}`}>
                    <Button variant="outline">
                      Voir tous les produits
                    </Button>
                  </Link>
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


            </main>
          </div>
        </div>
      </div>
      </PageWrapper>
    </div>
  );
}
