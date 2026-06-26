import React, { Suspense } from 'react';
import AdminOrdersClient from "@/components/blocks/admin/AdminOrdersClient";
import { ShoppingBag } from 'lucide-react';
import Loading from './loading';
import { fetchAdminOrdersAction } from '@/actions/admin';

// Force dynamic fetching from DB on each request
export const dynamic = 'force-dynamic';

async function OrdersTableLoader({ page, limit }: { page: number; limit: number }) {
  const res = await fetchAdminOrdersAction(page, limit);

  if (!res.success) {
    return (
      <div className="p-8 text-center text-red-500 font-bold bg-red-50/50 dark:bg-red-955/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
        Une erreur est survenue lors de la récupération des commandes : {res.error}
      </div>
    );
  }

  return (
    <AdminOrdersClient
      initialOrders={res.orders || []}
      currentPage={res.currentPage || page}
      totalPages={res.totalPages || 0}
      totalCount={res.totalCount || 0}
    />
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = Number(resolvedSearchParams?.limit) || 10;

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-8 animate-in relative overflow-hidden">
      {/* Page Header (instant 0ms render) */}
      <div className="flex-shrink-0">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span>Admin</span>
          <span>/</span>
          <span className="text-slate-500 dark:text-slate-400 font-bold">Commandes</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="text-brand-primary" size={28} /> Gestion des Commandes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gérez, préparez et suivez les commandes de vos clients en temps réel.</p>
      </div>

      {/* Streaming the actual table and sheets inside Suspense */}
      <Suspense key={`${page}-${limit}`} fallback={<Loading />}>
        <OrdersTableLoader page={page} limit={limit} />
      </Suspense>
    </div>
  );
}
