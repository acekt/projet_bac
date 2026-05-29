"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${user?.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Mes Commandes</h1>
          <p className="text-slate-500 font-medium">Suivez l&apos;état de vos achats en temps réel.</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center" isHoverable={false}>
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune commande pour le moment</h3>
            <p className="text-slate-500 mb-8">Commencez vos courses pour voir vos commandes ici.</p>
            <Link href="/">
              <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all">
                Faire mes courses
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6" isHoverable={false}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">Commande #{order.id.slice(-6).toUpperCase()}</h4>
                      <p className="text-sm text-slate-400 font-medium">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total</p>
                      <p className="text-lg font-black text-brand-secondary">{order.total.toLocaleString()} CFA</p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
                       <Clock size={16} />
                       <span className="text-xs font-bold uppercase">{order.status}</span>
                    </div>

                    <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
