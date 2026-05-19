"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <Card className="w-full max-w-md p-8 sm:p-10" isHoverable={false}>
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Bon retour !</h1>
          <p className="text-slate-500">Connectez-vous pour gérer vos courses.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="votre@email.com"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mot de passe</label>
              <Link href="/auth/forgot" className="text-xs font-bold text-brand-primary hover:underline">Oublié ?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <Button className="w-full h-14 text-lg font-bold">
            Se connecter <ArrowRight className="ml-2" />
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="font-bold text-brand-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
