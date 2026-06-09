"use client";

import React, { useState, use, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PageWrapper } from '@/components/common/PageWrapper';
import { Product as ProductType } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Produit non trouvé</div>;

  return (
    <PageWrapper>
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Link href={`/store/${product.storeId}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm font-medium mb-8 group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour au magasin {product.store?.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100">
               <Image
                 src={(() => {
                   try {
                     const imgs = JSON.parse(product.images || '[]');
                     return imgs[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop';
                   } catch(e) {
                     return product.images || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop';
                   }
                 })()}
                 alt={product.name}
                 fill
                 priority
                 className="object-contain p-12"
               />
               <button className="absolute top-6 right-6 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                 <Heart size={24} />
               </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(() => {
                try {
                  const imgs = JSON.parse(product.images || '[]');
                  return imgs.length > 0 ? imgs : [null];
                } catch(e) {
                  return [product.images];
                }
              })().map((img: string | null, i: number) => (
                <div key={i} className={`relative aspect-square rounded-2xl bg-slate-50 border-2 transition-all cursor-pointer ${i === 0 ? 'border-brand-primary' : 'border-transparent hover:border-slate-200'}`}>
                  <Image src={img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop'} alt="" fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

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
              <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-brand-primary">
                  {product.price.toLocaleString()} <span className="text-lg">CFA</span>
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-slate-400 line-through font-bold">
                    {product.oldPrice.toLocaleString()} CFA
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                Unité : {product.unit}
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                Stock : {product.stock} disponibles
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-extrabold text-xl text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <Button
                  onClick={() => {
                    if (!product) return;
                    for(let i=0; i<quantity; i++) addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category,
                      unit: product.unit || 'unité',
                      image: (() => {
                        try {
                          const imgs = JSON.parse(product.images || '[]');
                          return imgs[0] || '';
                        } catch(e) { return product.images || ''; }
                      })(),
                      storeId: product.storeId
                    });
                  }}
                  size="lg"
                  className="flex-1 h-14 rounded-2xl shadow-xl shadow-brand-primary/30"
                >
                  <ShoppingCart className="mr-2" size={24} />
                  Ajouter au panier
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                 {[
                   { icon: Truck, label: 'Livraison 60min' },
                   { icon: ShieldCheck, label: 'Produit Vérifié' },
                   { icon: RotateCcw, label: 'Retour Facile' }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                     <item.icon size={20} className="text-brand-primary" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
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
