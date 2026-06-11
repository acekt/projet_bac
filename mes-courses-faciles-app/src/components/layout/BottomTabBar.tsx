"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Search, User, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export const BottomTabBar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Search, label: 'Chercher', href: '/search' },
    { icon: ShoppingBag, label: 'Panier', href: '/cart', badge: totalItems },
    { icon: Heart, label: 'Favoris', href: '/favorites' },
    { icon: User, label: 'Profil', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-100 lg:hidden px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 min-w-0 transition-colors"
            >
              <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-400'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-brand-primary' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
