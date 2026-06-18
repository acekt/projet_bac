import { OrderStatus } from '@prisma/client';

export interface OrderStatusConfig {
  key: OrderStatus;
  adminLabel: string;
  clientLabel: string;
  badgeStyle: string; // Tailwind class
  stepperIndex: number | null; // 1, 2, 3 or null if not in active stepper
  description: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    key: 'PENDING',
    adminLabel: 'En attente',
    clientLabel: 'Reçue',
    badgeStyle: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-250/30',
    stepperIndex: 1,
    description: 'Commande enregistrée',
  },
  PAID: {
    key: 'PAID',
    adminLabel: 'En préparation',
    clientLabel: 'Validée',
    badgeStyle: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-250/30',
    stepperIndex: 2,
    description: 'Paiement confirmé',
  },
  SHIPPED: {
    key: 'SHIPPED',
    adminLabel: 'En livraison',
    clientLabel: 'En route',
    badgeStyle: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-250/30',
    stepperIndex: 3,
    description: 'En cours de livraison',
  },
  DELIVERED: {
    key: 'DELIVERED',
    adminLabel: 'Livrée',
    clientLabel: 'Livrée',
    badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-250/30',
    stepperIndex: null,
    description: 'Livraison effectuée',
  },
  CANCELLED: {
    key: 'CANCELLED',
    adminLabel: 'Annulée',
    clientLabel: 'Annulée',
    badgeStyle: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-250/30',
    stepperIndex: null,
    description: 'Commande annulée',
  },
};

export const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED'];
