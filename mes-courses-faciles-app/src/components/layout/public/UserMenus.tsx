"use client";

import React from 'react';
import Link from 'next/link';
import { User, LogOut, Heart, Package, Settings, LayoutDashboard, Store, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuGroup 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    name: string | null;
    email: string;
    role: string;
  } | null;
  logout: () => void | Promise<void>;
}

/**
 * Client-specific User Menu.
 * Strictly displays client options, ensuring zero admin links leak here.
 */
export function ClientUserMenu({ user, logout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary p-2 rounded-full ring-0 focus-visible:ring-0 cursor-pointer" />
        }
      >
        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
          <AvatarFallback className="font-bold bg-transparent text-primary border border-primary/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[100px] truncate font-medium">{user?.name || 'Client'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-border/50">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-bold text-slate-500">Mon Espace Client</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="rounded-xl">
            <Link href="/profile" className="flex items-center gap-2 w-full cursor-pointer">
              <User size={16} className="text-slate-400" />
              <span>Mon Profil</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="rounded-xl">
            <Link href="/profile?tab=orders" className="flex items-center gap-2 w-full cursor-pointer">
              <Package size={16} className="text-slate-400" />
              <span>Mes Commandes</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="rounded-xl">
            <Link href="/favorites" className="flex items-center gap-2 w-full cursor-pointer">
              <Heart size={16} className="text-red-400" />
              <span>Mes Favoris</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout} 
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Admin-specific User Menu.
 * Strictly displays admin management options and workspace paths.
 */
export function AdminUserMenu({ user, logout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/10 hover:text-accent p-2 rounded-full ring-0 focus-visible:ring-0 cursor-pointer" />
        }
      >
        <Avatar className="h-8 w-8 bg-accent/10 text-accent">
          <AvatarFallback className="font-bold bg-transparent text-accent border border-accent/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[100px] truncate font-medium text-accent">{user?.name || 'Admin'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-border/50">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-bold text-accent">Espace Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="rounded-xl">
            <Link href="/admin" className="flex items-center gap-2 w-full cursor-pointer">
              <LayoutDashboard size={16} className="text-accent" />
              <span className="font-bold text-accent">Interface Admin</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl">
            <Link href="/admin/settings" className="flex items-center gap-2 w-full cursor-pointer">
              <Settings size={16} className="text-slate-400" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl">
            <Link href="/admin/orders" className="flex items-center gap-2 w-full cursor-pointer">
              <ShoppingBag size={16} className="text-slate-400" />
              <span>Commandes</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl">
            <Link href="/admin/stores" className="flex items-center gap-2 w-full cursor-pointer">
              <Store size={16} className="text-slate-400" />
              <span>Magasins</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl">
            <Link href="/admin/products" className="flex items-center gap-2 w-full cursor-pointer">
              <Package size={16} className="text-slate-400" />
              <span>Catalogue</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout} 
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
