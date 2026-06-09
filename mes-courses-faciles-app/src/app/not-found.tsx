import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-4 text-center space-y-6">
      <div className="relative">
        <div className="text-[12rem] font-black text-slate-100 leading-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag size={80} className="text-brand-primary animate-bounce" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800">Oups ! Page introuvable</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Il semblerait que vous ayez pris un mauvais rayon. La page que vous cherchez n&apos;existe plus ou a été déplacée.
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="px-8 h-14 font-bold gap-2">
          <ArrowLeft size={20} /> Retour à l&apos;accueil
        </Button>
      </Link>
    </div>
  );
}
