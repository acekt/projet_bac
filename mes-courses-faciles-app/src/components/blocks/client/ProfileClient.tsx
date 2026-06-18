"use client";

import React, { useState } from 'react';
import { Package, Heart, LogOut, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { PageLayout } from '@/components/common/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Order as OrderType } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OrderDetailsSheet } from './OrderDetailsSheet';

interface ProfileClientProps {
  initialUser: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  initialOrders: OrderType[];
}

export function ProfileClient({ initialUser, initialOrders }: ProfileClientProps) {

  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const { logout } = useAuth();

  const [orders] = useState<OrderType[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const MENU_ITEMS = [
    { icon: Heart, label: 'Mes Favoris', href: '/favorites', color: 'text-red-500 bg-red-50' },
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

  return (
    <PageLayout withPadding>
      <div className="container mx-auto px-4 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* En-tête standardisé avec bouton de déconnexion dans la zone children */}
        <PageHeader
          backHref="/"
          backLabel="Accueil"
          title={initialUser.name || 'Mon Profil'}
          subtitle={initialUser.email}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive gap-2 font-bold rounded-xl"
          >
            <LogOut size={18} /> Déconnexion
          </Button>
        </PageHeader>

        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-black border-4 border-background shadow-md animate-scale-in">
              {initialUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Mail size={16} /> {initialUser.email}
              </p>
              <div className="flex gap-2 pt-1">
                <Badge variant={initialUser.role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-md px-2 py-0.5">
                  {initialUser.role === 'ADMIN' ? 'Administrateur' : 'Client Privilège'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 p-1 rounded-2xl mb-8">
            <TabsTrigger value="profile" className="rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Mon Profil</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Mes Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
             {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 text-center bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={24} />
                 </div>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">{orders.length}</p>
                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Commandes passées</p>
              </div>
              <div className="p-6 text-center bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={24} />
                 </div>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">
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
                      <span className="font-bold text-slate-800 dark:text-white">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </Card>


          </TabsContent>

          <TabsContent value="orders" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            {orders.length === 0 ? (
              <Card className="p-16 text-center border-border/50 border-dashed rounded-3xl bg-muted/30">
                <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground shadow-sm">
                  <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">Aucune commande</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Vous n&apos;avez pas encore passé de commande. Découvrez les meilleurs produits de nos magasins partenaires.</p>
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                  <Link href="/">Commencer mes courses</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const status = getStatusDisplay(order.status);
                  const StatusIcon = status.icon;

                  return (
                    <Card 
                      key={order.id} 
                      onClick={() => { setSelectedOrder(order); setIsSheetOpen(true); }}
                      className="p-6 border-border/50 hover:border-brand-primary/40 hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden relative cursor-pointer group"
                    >
                      {/* Timeline Visual */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-muted">
                          <div className={`w-full ${order.status === 'DELIVERED' ? 'h-full bg-green-500' : order.status === 'SHIPPED' ? 'h-2/3 bg-purple-500' : order.status === 'CANCELLED' ? 'h-full bg-red-500' : 'h-1/3 bg-yellow-500'}`} />
                      </div>

                      <div className="pl-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">Commande #{order.id.slice(-6).toUpperCase()}</h4>
                              <Badge className={`${status.color} border-none font-bold px-3 py-1 rounded-full gap-1.5`}>
                                 <StatusIcon size={14} strokeWidth={2.5} /> {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                              <Calendar size={14} /> Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Montant Total</p>
                              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{order.total.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">CFA</span></p>
                            </div>
                            <Separator orientation="vertical" className="h-10 hidden md:block" />
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 transition-all">
                              <ChevronRight size={24} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailsSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        order={selectedOrder} 
      />
    </PageLayout>
  );
}
