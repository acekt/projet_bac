"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Search, User, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/blocks/cart/CartDrawer';

export const BottomTabBar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Search, label: 'Chercher', href: '/search' },
    // ShoppingBag is handled separately via CartDrawer
    { icon: Heart, label: 'Favoris', href: '/favorites' },
    { icon: User, label: 'Profil', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border/50 lg:hidden px-2 pb-safe supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;

          // Inject CartDrawer in the middle
          if (index === 2) {
             return (
                 <div key="cart-drawer" className="flex flex-col items-center justify-center flex-1 min-w-0 transition-colors">
                     <CartDrawer isBottomTab />
                     <span className={`text-[10px] font-medium mt-0.5 transition-colors text-muted-foreground`}>
                        Panier
                     </span>
                 </div>
             )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 min-w-0 transition-colors"
            >
              <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Render the last item since we injected Cart in the middle */}
        <Link
          href={navItems[navItems.length - 1].href}
          className="flex flex-col items-center justify-center flex-1 min-w-0 transition-colors"
        >
          <div className={`relative p-1 rounded-xl transition-all ${pathname === navItems[navItems.length - 1].href ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
            <User size={24} strokeWidth={pathname === navItems[navItems.length - 1].href ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-medium mt-0.5 transition-colors ${pathname === navItems[navItems.length - 1].href ? 'text-primary' : 'text-muted-foreground'}`}>
            Profil
          </span>
        </Link>
      </div>
    </nav>
  );
};
