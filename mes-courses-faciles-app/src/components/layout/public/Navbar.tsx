"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CartDrawer } from '@/components/blocks/cart/CartDrawer';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                 <SheetTitle className="text-left font-bold text-xl text-primary flex items-center gap-2">
                     <ShoppingBag className="h-6 w-6" /> MesAchats241
                 </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Accueil</Link>
                <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors">Catégories</Link>
                <Link href="/stores" className="text-lg font-medium hover:text-primary transition-colors">Magasins</Link>

                <div className="h-px bg-border my-4" />

                {isAuthenticated ? (
                  <>
                    <div className="font-medium text-muted-foreground mb-2">Bonjour, {user?.name || 'Client'}</div>
                    <Link href="/profile" className="text-lg font-medium hover:text-primary transition-colors">Mon Compte</Link>
                    <Link href="/profile?tab=orders" className="text-lg font-medium hover:text-primary transition-colors">Mes Commandes</Link>
                    {user?.role === 'ADMIN' && (
                       <Link href="/admin" className="text-lg font-medium text-accent hover:underline">Panel Admin</Link>
                    )}
                    <Button variant="ghost" className="justify-start px-0 text-destructive hover:text-destructive hover:bg-transparent mt-2" onClick={logout}>
                        Déconnexion
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                       <Link href="/auth/login">Se connecter</Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                       <Link href="/auth/register">Créer un compte</Link>
                    </Button>
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
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative group">
           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
           </div>
           <Input
             type="search"
             placeholder="Rechercher un produit, un magasin..."
             className="w-full pl-10 h-11 bg-muted/50 border-transparent hover:bg-muted focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-full shadow-sm"
           />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
             {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* User Auth Desktop */}
          <div className="hidden lg:flex items-center gap-4">
             {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/10 hover:text-accent p-2 rounded-full ring-0 focus-visible:ring-0">
                          <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                            <AvatarFallback className="font-bold bg-transparent text-primary border border-primary/20">
                              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[100px] truncate font-medium">{user?.name || 'Compte'}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href="/profile" className="cursor-pointer">Profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/profile?tab=orders" className="cursor-pointer">Mes commandes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/favorites" className="cursor-pointer">Mes favoris</Link>
                        </DropdownMenuItem>

                        {user?.role === 'ADMIN' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href="/admin" className="cursor-pointer font-bold text-accent">Interface Admin</Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
             ) : (
                <div className="flex items-center gap-3">
                   <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Connexion</Link>
                   <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5">
                       <Link href="/auth/register">S&apos;inscrire</Link>
                   </Button>
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
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search className="h-5 w-5" />
             </div>
             <Input
               type="search"
               placeholder="Rechercher..."
               className="w-full pl-10 h-11 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-full"
               autoFocus
             />
          </div>
        </div>
      )}
    </header>
  );
}
