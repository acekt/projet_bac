import React, { Suspense } from 'react';
import prisma from "@/lib/prisma";
import AdminOrdersClient from "@/components/blocks/admin/AdminOrdersClient";
import { ShoppingBag } from 'lucide-react';
import Loading from './loading';

// Force dynamic fetching from DB on each request
export const dynamic = 'force-dynamic';

async function OrdersTableLoader() {
  const dbOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        }
      },
      store: {
        select: {
          id: true,
          name: true,
        }
      },
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Map and serialize Prisma objects, transforming Dates to ISO strings
  const initialOrders = dbOrders.map(order => ({
    id: order.id,
    userId: order.userId,
    storeId: order.storeId,
    total: order.total,
    deliveryFee: order.deliveryFee,
    status: order.status,
    paymentMethod: order.paymentMethod,
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: order.user ? {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
      address: order.user.address,
    } : null,
    store: order.store ? {
      id: order.store.id,
      name: order.store.name,
    } : null,
    orderItems: order.orderItems ? order.orderItems.map(item => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        images: item.product.images,
      } : null
    })) : []
  }));

  return <AdminOrdersClient initialOrders={initialOrders} />;
}

export default function AdminOrdersPage() {
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
      <Suspense fallback={<Loading />}>
        <OrdersTableLoader />
      </Suspense>
    </div>
  );
}
