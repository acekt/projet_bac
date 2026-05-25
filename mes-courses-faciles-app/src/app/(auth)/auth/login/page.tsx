"use client";

import React, { useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur lors de la connexion');

      login(data);
      router.push(callbackUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 sm:p-10" isHoverable={false}>
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Bon retour !</h1>
          <p className="text-slate-500">Connectez-vous pour gérer vos courses.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="email"
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
                name="password"
                type="password"
                placeholder="••••••••"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <Button disabled={loading} className="w-full h-14 text-lg font-bold">
            {loading ? <Loader2 className="animate-spin" /> : <>Se connecter <ArrowRight className="ml-2" /></>}
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
