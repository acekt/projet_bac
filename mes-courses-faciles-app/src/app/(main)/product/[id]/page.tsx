import React from 'react';
import { ProductGallery } from '@/components/blocks/catalog/ProductGallery';
import { ProductActions } from '@/components/blocks/catalog/ProductActions';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true }
  });
  return {
    title: product ? `${product.name} | MesAchats241` : 'Produit | MesAchats241',
    description: product?.description || 'Achetez vos produits en ligne à Libreville.',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      store: {
        select: {
          name: true,
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-mesh bg-noise relative overflow-hidden">
        {/* Visual background flares */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <BackButton href={`/store/${product.storeId}`} label={`Retour au magasin ${product.store?.name || ''}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Gallery */}
            <ProductGallery imagesString={product.images} name={product.name} />

            {/* Product Info */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-accent text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">•</span>
                  <span className="text-slate-500 text-sm font-bold uppercase">{product.store?.name}</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-brand-primary">
                    {product.price.toLocaleString()} <span className="text-lg">CFA</span>
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-slate-650 dark:text-slate-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                  Unité : {product.unit || 'unité'}
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                  Stock : {product.stock} disponibles
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/5" />

              {/* Actions */}
              <div className="space-y-6">
                <ProductActions
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  unit={product.unit}
                  images={product.images}
                  storeId={product.storeId}
                />

                <div className="grid grid-cols-3 gap-4 pt-4">
                   {[
                     { icon: Truck, label: 'Livraison 60min' },
                     { icon: ShieldCheck, label: 'Produit Vérifié' },
                     { icon: RotateCcw, label: 'Retour Facile' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-center">
                       <item.icon size={20} className="text-brand-primary" />
                       <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{item.label}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
