import React, { Suspense } from 'react';
import prisma from "@/lib/prisma";
import AdminProductsClient from "@/components/blocks/admin/AdminProductsClient";
import { Product as ProductType } from '@/types';
import { Package as PackageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loading from './loading';

// Force dynamic fetching from DB on each request
export const dynamic = 'force-dynamic';

async function ProductsTableLoader() {
  const dbProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      store: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Map and serialize Prisma objects into serializable ProductType instances
  const initialProducts: ProductType[] = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price), // Convert Decimal or raw value to number
    category: product.category,
    stock: product.stock,
    unit: product.unit,
    images: product.images,
    isActive: product.isActive,
    storeId: product.storeId,
    store: product.store ? {
      id: product.store.id,
      name: product.store.name,
      address: product.store.address,
      district: product.store.district,
      phone: product.store.phone,
      logo: product.store.logo,
      description: product.store.description,
      isActive: product.store.isActive
    } : undefined
  }));

  return <AdminProductsClient initialProducts={initialProducts} />;
}

export default function AdminProductsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-8 animate-in relative overflow-hidden">
      {/* Page Header (instant 0ms render) */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-500 dark:text-slate-400 font-bold">Catalogue</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <PackageIcon className="text-brand-primary" size={28} /> Gestion du Catalogue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gérez et configurez le catalogue des produits partenaires.</p>
        </div>
        <Link href="?new=product" prefetch={true}>
          <Button 
            className="gap-2 h-11 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer transition-all"
          >
            <Plus size={20} /> Nouveau Produit
          </Button>
        </Link>
      </div>

      {/* Streaming the actual table and sheets inside Suspense */}
      <Suspense fallback={<Loading />}>
        <ProductsTableLoader />
      </Suspense>
    </div>
  );
}
