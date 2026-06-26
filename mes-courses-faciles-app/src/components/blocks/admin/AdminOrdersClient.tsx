"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import { DataTable } from '@/components/common/DataTable';
import { OrderDetailsSheet } from '@/components/blocks/admin/OrderDetailsSheet';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@/components/ui/status-badge';
import { getOrderStatusConfig } from '@/lib/constants/order-statuses';

interface AdminOrdersClientProps {
  initialOrders: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function AdminOrdersClient({
  initialOrders,
  currentPage,
  totalPages,
  totalCount,
}: AdminOrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const orderIdFromUrl = searchParams.get('orderId');

  useEffect(() => {
    if (orderIdFromUrl) {
      const order = initialOrders.find(o => o.id === orderIdFromUrl);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orderIdFromUrl, initialOrders]);

  const handleStatusUpdated = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID Commande',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          #{row.original.id.substring(0, 8).toUpperCase()}
        </span>
      )
    },
    {
      accessorKey: 'user.name',
      header: 'Client',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs flex-shrink-0">
              {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="leading-none min-w-0">
              <span className="font-bold text-slate-850 dark:text-slate-200 text-sm block truncate">{order.user?.name || 'Client anonyme'}</span>
              <span className="text-xs text-slate-400 dark:text-slate-450 font-semibold truncate block mt-0.5">{order.user?.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'total',
      header: 'Montant',
      cell: ({ row }) => (
        <span className="font-extrabold text-slate-800 dark:text-emerald-400">
          {row.original.total.toLocaleString('fr-FR')} CFA
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const dateStr = typeof row.original.createdAt === 'string'
          ? row.original.createdAt
          : (row.original.createdAt as Date).toISOString();
        return (
          <span className="text-slate-550 dark:text-slate-400 font-semibold text-xs">
            {new Date(dateStr).toLocaleString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        );
      }
    },
    {
      id: 'paymentMethod',
      accessorFn: (row) => {
        const method = row.paymentMethod || '';
        switch (method.toLowerCase()) {
          case 'airtel': return 'Airtel Money';
          case 'moov': return 'Moov Money';
          case 'card': return 'Carte Bancaire';
          case 'cash':
          default:
            return 'Espèces';
        }
      },
      header: 'Paiement',
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        const paymentDetails = (m: string) => {
          switch (m.toLowerCase()) {
            case 'airtel':
              return { label: 'Airtel', icon: Smartphone, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' };
            case 'moov':
              return { label: 'Moov', icon: Smartphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' };
            case 'card':
              return { label: 'Carte', icon: CreditCard, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' };
            case 'cash':
            default:
              return { label: 'Espèces', icon: Banknote, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' };
          }
        };
        const p = paymentDetails(method);
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-350">
            <p.icon size={12} className={p.color.split(' ')[0]} />
            <span>{p.label}</span>
          </div>
        );
      }
    },
    {
      id: 'status',
      accessorFn: (row) => getOrderStatusConfig(row.status).label,
      header: 'Statut',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedOrder(row.original)}
          className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover hover:underline flex items-center gap-1 cursor-pointer"
        >
          Gérer
        </button>
      )
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <DataTable 
        columns={columns} 
        data={initialOrders} 
        searchPlaceholder="Rechercher par ID, client, montant, statut..." 
        serverPagination={{
          currentPage,
          totalPages,
          totalCount,
        }}
      />

      {/* Slide-out details Drawer (Sheet) */}
      <OrderDetailsSheet 
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}
