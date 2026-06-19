"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';

import { CartDrawer } from '@/components/blocks/cart/CartDrawer';
import { SearchSuggestionsInput } from '@/components/blocks/search/SearchSuggestionsInput';
import { ClientUserMenu, AdminUserMenu } from './UserMenus';


export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="shrink-0" />
              }
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                 <SheetTitle className="text-left font-bold text-xl text-primary flex items-center gap-2">
                     <ShoppingBag className="h-6 w-6" /> MesAchats241
                 </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Accueil</Link>

                <div className="h-px bg-border my-4" />


                {isAuthenticated ? (
                  <>
                    <div className="font-medium text-muted-foreground mb-2">Bonjour, {user?.name || 'Client'}</div>
                    <Link href={user?.role === 'ADMIN' ? '/admin/settings' : '/profile'} className="text-lg font-medium hover:text-primary transition-colors">Mon Compte</Link>
                    <Link href={user?.role === 'ADMIN' ? '/admin/orders' : '/profile?tab=orders'} className="text-lg font-medium hover:text-primary transition-colors">Mes Commandes</Link>
                    {user?.role === 'ADMIN' && (
                       <Link href="/admin" className="text-lg font-medium text-accent hover:underline">Panel Admin</Link>
                    )}
                    <Button variant="ghost" className="justify-start px-0 text-destructive hover:text-destructive hover:bg-transparent mt-2" onClick={logout}>
                        Déconnexion
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link 
                      href="?auth=login" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium transition-all"
                    >
                      Se connecter
                    </Link>
                    <Link 
                      href="?auth=register" 
                      className="w-full border border-border bg-background hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium transition-all"
                    >
                      Créer un compte
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-bold text-xl tracking-tight text-primary flex items-center gap-1.5 shrink-0">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline-block">MesAchats241</span>
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden lg:flex font-bold text-2xl tracking-tight text-primary items-center gap-2 shrink-0">
            <ShoppingBag className="h-7 w-7" />
            MesAchats241
        </Link>

        {/* Search Bar (Desktop) */}
        <SearchSuggestionsInput
          placeholder="Rechercher un produit, un magasin..."
          className="hidden lg:flex flex-1 max-w-2xl mx-8"
        />

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
             {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* User Auth Desktop */}
          <div className="hidden lg:flex items-center gap-4">
             {isAuthenticated ? (
                <div className="flex items-center gap-2">
                    {user?.role === 'ADMIN' ? (
                      <AdminUserMenu user={user} logout={logout} />
                    ) : (
                      <ClientUserMenu user={user} logout={logout} />
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={logout} 
                      title="Se déconnecter" 
                      className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full h-8 w-8 p-0 cursor-pointer transition-colors"
                    >
                      <LogOut size={16} strokeWidth={2.5} />
                    </Button>
                </div>
             ) : (
                 <div className="flex items-center gap-3">
                    <Link href="?auth=login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Connexion</Link>
                    <Link 
                      href="?auth=register" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 h-7 inline-flex items-center justify-center text-[0.8rem] font-medium transition-all"
                    >
                      S&apos;inscrire
                    </Link>
                 </div>
             )}
          </div>

          {/* Cart Button via CartDrawer */}
          <CartDrawer />
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {isSearchOpen && (
        <div className="lg:hidden border-t border-border/50 p-4 bg-background animate-in slide-in-from-top-2">
          <SearchSuggestionsInput
            placeholder="Rechercher..."
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}
