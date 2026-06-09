"use client";

import React from 'react';
import { User, Package, MapPin, Heart, Bell, Settings, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const MENU_ITEMS = [
    { icon: Package, label: 'Mes Commandes', href: '/orders', color: 'text-blue-500 bg-blue-50' },
    { icon: Heart, label: 'Mes Favoris', href: '/favorites', color: 'text-red-500 bg-red-50' },
    { icon: MapPin, label: 'Adresses enregistrées', href: '/addresses', color: 'text-green-500 bg-green-50' },
    { icon: Bell, label: 'Notifications', href: '/notifications', color: 'text-orange-500 bg-orange-50' },
    { icon: Settings, label: 'Paramètres', href: '/settings', color: 'text-slate-500 bg-slate-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-brand-primary rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-brand-primary/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800">{user?.name}</h1>
            <p className="text-slate-500 font-medium">{user?.email}</p>
            <div className="flex gap-2 pt-1">
              <span className="px-2 py-1 bg-brand-accent text-brand-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
                {user?.role === 'ADMIN' ? 'Administrateur' : 'Membre Client'}
              </span>
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

        {/* Menu */}
        <Card className="overflow-hidden p-0">
          <div className="divide-y divide-slate-100">
            {MENU_ITEMS.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{item.label}</span>
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
