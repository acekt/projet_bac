"use client";

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Package
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface OrderDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null; // Can include orderItems and store
}

export function OrderDetailsSheet({ isOpen, onClose, order }: OrderDetailsSheetProps) {
  if (!order) return null;

  // getStatusBadge removed in favor of StatusBadge

  // Get payment method rendering
  const getPaymentDetails = (method: string) => {
    switch (method.toLowerCase()) {
      case 'airtel':
        return { label: 'Airtel Money', icon: Smartphone, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' };
      case 'moov':
        return { label: 'Moov Money', icon: Smartphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' };
      case 'card':
        return { label: 'Carte Bancaire', icon: CreditCard, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' };
      case 'cash':
      default:
        return { label: 'À la livraison', icon: Banknote, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' };
    }
  };

  const payment = getPaymentDetails(order.paymentMethod);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="sm:max-w-xl w-full sm:w-[600px] bg-slate-50/95 dark:bg-slate-950/90 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 shadow-2xl flex flex-col h-full p-0 overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <ShoppingBag size={24} className="text-brand-primary" /> Commande #{order.id.substring(0, 8).toUpperCase()}
              </SheetTitle>
              <SheetDescription suppressHydrationWarning className="text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                <Calendar size={14} /> Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </SheetDescription>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Delivery & Payment Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-brand-primary" /> Détails Livraison & Paiement
            </h4>
            <div className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-850 rounded-3xl space-y-4 text-sm font-medium">
              <div>
                <span className="text-slate-450 dark:text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Magasin d&apos;origine</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{order.store?.name}</span>
              </div>
              
              <div>
                <span className="text-slate-455 dark:text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Adresse de livraison</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">{order.deliveryAddress}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-450 dark:text-slate-400">Mode de Paiement</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <payment.icon size={16} className={payment.color.split(' ')[0]} />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{payment.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Basket Summary Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-455 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Package size={16} className="text-brand-primary" /> Récapitulatif du Panier
            </h4>
            
            <div className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-850 rounded-3xl space-y-4">
              <div className="divide-y divide-slate-100 dark:divide-slate-855 space-y-3">
                {order.orderItems?.map((item: any, idx: number) => {
                  let img = '';
                  try {
                    if (item.product?.images) {
                      const parsed = JSON.parse(item.product.images);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        img = parsed[0];
                      }
                    }
                  } catch (e) {
                    console.error(e);
                  }

                  return (
                    <div key={item.id} className={`flex items-center gap-3 ${idx > 0 ? 'pt-3' : ''}`}>
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-200/50 dark:border-slate-800 relative">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={item.product?.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block truncate leading-tight">
                          {item.product?.name || 'Produit'}
                        </span>
                        <span className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1 block">
                          {item.quantity} × {item.price.toLocaleString('fr-FR')} CFA
                        </span>
                      </div>
                      <span className="text-slate-800 dark:text-slate-100 font-extrabold text-sm flex-shrink-0">
                        {(item.quantity * item.price).toLocaleString('fr-FR')} CFA
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2 text-sm font-semibold">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Sous-total</span>
                  <span>{(order.total - order.deliveryFee).toLocaleString('fr-FR')} CFA</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Frais de livraison</span>
                  <span>{order.deliveryFee.toLocaleString('fr-FR')} CFA</span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-white font-extrabold text-base pt-1">
                  <span>Total</span>
                  <span className="text-brand-primary">{order.total.toLocaleString('fr-FR')} CFA</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 z-10">
          <Button 
            onClick={onClose} 
            className="h-12 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer"
          >
            Fermer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
