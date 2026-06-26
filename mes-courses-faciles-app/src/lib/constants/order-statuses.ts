import { Clock, CheckCircle2, Truck, XCircle, Package } from 'lucide-react';

export interface OrderStatusConfig {
  label: string;
  color: string;
  icon: any;
}

export const ORDER_STATUSES: Record<string, OrderStatusConfig> = {
  PENDING: {
    label: 'En attente',
    color: 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
    icon: Clock,
  },
  PAID: {
    label: 'En préparation',
    color: 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: 'En livraison',
    color: 'bg-sky-50 text-sky-600 border border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Livré',
    color: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Annulé',
    color: 'bg-rose-50 text-rose-700 border border-rose-250 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
    icon: XCircle,
  },
};

export function getOrderStatusConfig(status: string): OrderStatusConfig {
  return ORDER_STATUSES[status] || {
    label: status,
    color: 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-white/5',
    icon: Package,
  };
}
