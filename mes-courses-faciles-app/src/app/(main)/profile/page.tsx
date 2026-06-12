"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { User, Package, MapPin, Heart, Bell, Settings, LogOut, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BackButton } from '@/components/common/BackButton';
import { Order as OrderType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

function ProfileContent() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/?auth=login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (defaultTab === 'orders' || user?.id) {
       loadOrders();
    }
  }, [user?.id, defaultTab]);

  const MENU_ITEMS = [
    { icon: Package, label: 'Mes Commandes', href: '/orders', color: 'text-blue-500 bg-blue-50' },
    { icon: Heart, label: 'Mes Favoris', href: '/favorites', color: 'text-red-500 bg-red-50' },
    { icon: MapPin, label: 'Adresses enregistrées', href: '/addresses', color: 'text-green-500 bg-green-50' },
    { icon: Bell, label: 'Notifications', href: '/notifications', color: 'text-orange-500 bg-orange-50' },
    { icon: Settings, label: 'Paramètres', href: '/settings', color: 'text-slate-500 bg-slate-50' },
  ];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100', icon: Clock };
      case 'PAID': return { label: 'Validé', color: 'bg-blue-100 text-blue-700 hover:bg-blue-100', icon: CheckCircle2 };
      case 'SHIPPED': return { label: 'En route', color: 'bg-purple-100 text-purple-700 hover:bg-purple-100', icon: Truck };
      case 'DELIVERED': return { label: 'Livré', color: 'bg-green-100 text-green-700 hover:bg-green-100', icon: CheckCircle2 };
      case 'CANCELLED': return { label: 'Annulé', color: 'bg-red-100 text-red-700 hover:bg-red-100', icon: XCircle };
      default: return { label: status, color: 'bg-slate-100 text-slate-700 hover:bg-slate-100', icon: Package };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mesh bg-noise relative overflow-hidden py-12">
      {/* Visual background flares */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        {/* Back Navigation */}
        <div className="flex justify-start">
          <BackButton href="/" label="Retour à l'accueil" />
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black border-4 border-background shadow-md animate-scale-in">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-3xl font-black text-foreground tracking-tight">{user?.name}</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Mail size={16} /> {user?.email}
              </p>
              <div className="flex gap-2 pt-2">
                <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-md px-2 py-0.5">
                  {user?.role === 'ADMIN' ? 'Administrateur' : 'Client Privilège'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center">
             <p className="text-2xl font-black text-slate-800">12</p>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Commandes</p>
          </Card>
          <Card className="p-6 text-center">
             <p className="text-2xl font-black text-slate-800">145k</p>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">CFA dépensés</p>
          </Card>
        </div>

          <TabsContent value="profile" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
             {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 text-center bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={24} />
                 </div>
                 <p className="text-3xl font-black text-foreground">{orders.length}</p>
                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Commandes passées</p>
              </div>
              <div className="p-6 text-center bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={24} />
                 </div>
                 <p className="text-3xl font-black text-foreground">
                    {orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
                 </p>
                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">CFA Dépensés</p>
              </div>
            </div>

            {/* Menu */}
            <Card className="overflow-hidden p-0 border-border/50 shadow-sm">
              <div className="divide-y divide-border/50">
                {MENU_ITEMS.map((item, i) => (
                  <Link key={i} href={item.href} className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </Card>

            {/* Support Section */}
            <Card className="p-8 bg-foreground text-background relative overflow-hidden rounded-3xl border-none">
               <div className="relative z-10 space-y-4 max-w-sm">
                 <h3 className="text-2xl font-black">Besoin d&apos;aide ?</h3>
                 <p className="text-muted text-sm leading-relaxed">Notre équipe est disponible 7j/7 pour vous accompagner dans vos courses et le suivi de vos livraisons.</p>
                 <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-lg shadow-primary/20 rounded-xl font-bold mt-2">
                   Contacter le support
                 </Button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
               <ShoppingBag size={140} className="absolute -bottom-8 -right-8 text-background/10 rotate-12" />
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            {loadingOrders ? (
               <div className="py-20 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
               </div>
            ) : orders.length === 0 ? (
              <Card className="p-16 text-center border-border/50 border-dashed rounded-3xl bg-muted/30">
                <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground shadow-sm">
                  <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-primary transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Support Section */}
        <Card className="p-8 bg-brand-secondary text-white relative overflow-hidden">
           <div className="relative z-10 space-y-4">
             <h3 className="text-xl font-bold">Besoin d&apos;aide ?</h3>
             <p className="text-slate-400 text-sm">Notre équipe est disponible 7j/7 pour vous accompagner dans vos courses.</p>
             <Button className="bg-brand-primary hover:bg-brand-primary/90 border-none shadow-lg shadow-brand-primary/30">
               Contacter le support
             </Button>
           </div>
           <ShoppingBag size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
        </Card>

        <Button onClick={logout} variant="outline" className="w-full h-14 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 gap-2 font-bold">
          <LogOut size={20} /> Se déconnecter
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

