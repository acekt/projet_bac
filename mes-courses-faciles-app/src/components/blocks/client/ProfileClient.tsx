"use client";

import React, { useState, use, Suspense } from 'react';
import {
  Package, Heart, ChevronRight, ShoppingBag, Truck,
  CheckCircle2, Clock, XCircle, Calendar, Mail, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { PageLayout } from '@/components/common/PageLayout';
import { BackButton } from '@/components/common/BackButton';
import { Order as OrderType } from '@/types';
import { useSearchParams } from 'next/navigation';
import { updateProfileAction } from '@/actions/auth';
import { OrderDetailsSheet } from './OrderDetailsSheet';
import { OrderListSkeleton, ProfileStatsSkeleton } from '@/components/common/Skeletons';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { StatusBadge } from '@/components/ui/status-badge';

interface ProfileClientProps {
  initialUser: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    role: string;
  };
  ordersPromise: Promise<{
    orders: OrderType[];
    totalPages: number;
    currentPage: number;
  }>;
  statsPromise: Promise<{
    count: number;
    totalSpent: number;
  }>;
}

const parseAddress = (addressString: string | null) => {
  if (!addressString) return { district: '', indications: '' };
  const parts = addressString.split(' | Indications: ');
  if (parts.length > 1) {
    return { district: parts[0], indications: parts[1] };
  }
  const simpleParts = addressString.split(' | ');
  if (simpleParts.length > 1) {
    return { district: simpleParts[0], indications: simpleParts[1] };
  }
  return { district: addressString, indications: '' };
};

const formatAddress = (district: string, indications: string) => {
  if (!indications.trim()) return district.trim();
  return `${district.trim()} | Indications: ${indications.trim()}`;
};

// getStatusDisplay removed in favor of StatusBadge

function StatsContainer({
  statsPromise
}: {
  statsPromise: Promise<{ count: number; totalSpent: number }>;
}) {
  const stats = use(statsPromise);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center gap-5 p-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20">
          <Package size={28} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Commandes passées</p>
          <p className="text-3xl font-black text-slate-850 dark:text-white leading-none">{stats.count}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-5 p-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 bg-brand-safran/10 text-brand-safran rounded-2xl flex items-center justify-center border border-brand-safran/20">
          <Wallet size={28} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">CFA Dépensés</p>
          <p className="text-3xl font-black text-slate-850 dark:text-white leading-none">
            {(stats?.totalSpent || 0).toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-400">CFA</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function OrdersListContainer({
  ordersPromise,
  setSelectedOrder,
  setIsSheetOpen
}: {
  ordersPromise: Promise<{
    orders: OrderType[];
    totalPages: number;
    currentPage: number;
  }>;
  setSelectedOrder: (order: OrderType | null) => void;
  setIsSheetOpen: (open: boolean) => void;
}) {
  const { orders, totalPages, currentPage } = use(ordersPromise);

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const totalArticles = order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

        return (
          <Card
            key={order.id}
            className="p-6 border-border/50 hover:border-brand-primary/40 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden relative group"
          >
            {/* Left accent color bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-muted">
              <div className={`w-full ${
                order.status === 'DELIVERED' ? 'h-full bg-emerald-500' :
                order.status === 'SHIPPED' ? 'h-2/3 bg-brand-safran' :
                order.status === 'CANCELLED' ? 'h-full bg-red-500' :
                order.status === 'PAID' ? 'h-1/2 bg-blue-500' :
                'h-1/3 bg-slate-300'
              }`} />
            </div>

            <div className="pl-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">
                      #MCF-{order.id.slice(-6).toUpperCase()}
                    </h4>
                    <StatusBadge status={order.status} />
                  </div>
                  <p suppressHydrationWarning className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Résumé</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {totalArticles} {totalArticles > 1 ? 'articles' : 'article'} • <span className="font-extrabold text-slate-850 dark:text-white">{order.total.toLocaleString('fr-FR')} CFA</span>
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => { setSelectedOrder(order); setIsSheetOpen(true); }}
                    size="sm"
                    className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-bold text-xs rounded-xl px-4 h-9 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    Voir les détails
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <DataTablePagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export function ProfileClient({ initialUser, ordersPromise, statsPromise }: ProfileClientProps) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const parsedAddress = parseAddress(initialUser.address);
  const [name, setName] = useState(initialUser.name || '');
  const [phone, setPhone] = useState(initialUser.phone || '');
  const [district, setDistrict] = useState(parsedAddress.district);
  const [indications, setIndications] = useState(parsedAddress.indications);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const MENU_ITEMS = [
    { icon: Heart, label: 'Mes Favoris', href: '/favorites', color: 'text-red-500 bg-red-50 dark:bg-red-950/20' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Gabon phone validation: starting with +241 or 0, followed by 5, 6 or 7 and 7 to 8 digits
    const gabonPhoneRegex = /^(?:\+241[\s.-]?|0)[\s.-]?[567](?:[\s.-]?\d){7,8}$/;
    if (phone && !gabonPhoneRegex.test(phone)) {
      setErrorMsg("Format de téléphone Gabon invalide. Ex: +241 66 12 34 56 ou 066 12 34 56");
      setIsSubmitting(false);
      return;
    }

    if (!district.trim()) {
      setErrorMsg("Le quartier est requis");
      setIsSubmitting(false);
      return;
    }

    const formattedAddress = formatAddress(district, indications);

    const res = await updateProfileAction(initialUser.id, {
      name,
      phone,
      address: formattedAddress,
    });

    if (res.success) {
      setSuccessMsg("Votre profil a été mis à jour avec succès !");
      setIsEditing(false);
    } else {
      setErrorMsg(res.error || "Une erreur est survenue lors de la mise à jour du profil.");
    }
    setIsSubmitting(false);
  };

  return (
    <PageLayout withPadding>
      <div className="container mx-auto px-4 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Simple navigation to main page */}
        <div className="flex justify-start">
          <BackButton href="/" label="Accueil" />
        </div>

        {/* Premium Profile Header Card */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm rounded-2xl p-6 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar generated with initials */}
            <div className="w-20 h-20 bg-brand-safran/10 text-brand-safran rounded-full flex items-center justify-center text-3xl font-black border border-brand-safran/20 shadow-sm shrink-0">
              {initialUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white capitalize">{initialUser.name || 'Client MCF'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-none flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" /> {initialUser.email}
              </p>
              <div className="pt-1">
                <Badge className="bg-brand-safran/10 text-brand-safran border-brand-safran/20 hover:bg-brand-safran/20 font-bold text-xs rounded-full">
                  {initialUser.role === 'ADMIN' ? 'Administrateur' : 'Client Privilège'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setActiveTab('profile');
                setIsEditing(prev => !prev);
              }}
              variant="outline"
              className="border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl h-11 px-5 shadow-sm text-xs md:text-sm"
            >
              {isEditing ? "Annuler l'édition" : "Modifier mon profil"}
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 p-1 rounded-2xl mb-8">
            <TabsTrigger value="profile" className="rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Mon Profil</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl text-base font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Mes Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            {/* Stats Bento Grid */}
            <Suspense fallback={<ProfileStatsSkeleton />}>
              <StatsContainer statsPromise={statsPromise} />
            </Suspense>

            {/* Profile Information / Edit Form */}
            <Card className="p-6 border-border/50 shadow-sm bg-white/40 dark:bg-slate-800/10 backdrop-blur-md rounded-3xl">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Informations personnelles</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Gérez vos informations de contact et de livraison par défaut.</p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-in fade-in duration-300">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in duration-300">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nom complet</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-white/10 outline-none text-xs font-semibold focus:border-brand-primary/40 focus:shadow-glow transition-all text-foreground"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">{name || '-'}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email (Non modifiable)</label>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/10 p-3 rounded-xl border border-slate-200/30 dark:border-transparent select-none">
                      {initialUser.email}
                    </p>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      <span>Téléphone</span>
                      {isEditing && <span className="text-[9px] text-slate-450 dark:text-slate-550 lowercase tracking-normal">Ex: 066 12 34 56</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="077 12 34 56"
                        className="w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-white/10 outline-none text-xs font-semibold focus:border-brand-primary/40 focus:shadow-glow transition-all text-foreground"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">{phone || 'Aucun numéro configuré'}</p>
                    )}
                  </div>

                  {/* District field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quartier (Libreville)</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Ex: Louis, Glass, Angondjé..."
                        required
                        className="w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-white/10 outline-none text-xs font-semibold focus:border-brand-primary/40 focus:shadow-glow transition-all text-foreground"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">{district || 'Aucun quartier configuré'}</p>
                    )}
                  </div>

                  {/* Detailed Address / Indications field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Adresse détaillée / Indications</label>
                    {isEditing ? (
                      <textarea
                        value={indications}
                        onChange={(e) => setIndications(e.target.value)}
                        placeholder="Ex: Maison barrière bleue, 2ème ruelle après la pharmacie"
                        rows={3}
                        className="w-full p-4 rounded-xl bg-white/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-white/10 outline-none text-xs font-semibold focus:border-brand-primary/40 focus:shadow-glow transition-all text-foreground resize-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 min-h-16 leading-relaxed">
                        {indications || 'Aucune indication supplémentaire configurée'}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setName(initialUser.name || '');
                        setPhone(initialUser.phone || '');
                        setDistrict(parsedAddress.district);
                        setIndications(parsedAddress.indications);
                        setErrorMsg('');
                      }}
                      className="rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl px-6 h-11 shadow-md shadow-brand-primary/25 cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>Sauvegarde en cours...</>
                      ) : (
                        <>Sauvegarder les modifications</>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Card>

            {/* Menu */}
            <Card className="overflow-hidden p-0 border-border/50 shadow-sm rounded-2xl">
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
            <Suspense fallback={<OrderListSkeleton />}>
              <OrdersListContainer
                ordersPromise={ordersPromise}
                setSelectedOrder={setSelectedOrder}
                setIsSheetOpen={setIsSheetOpen}
              />
            </Suspense>
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
