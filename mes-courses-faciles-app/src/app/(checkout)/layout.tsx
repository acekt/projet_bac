import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Minimal Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-bold text-sm">
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Retour au panier</span>
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <ShoppingCart size={18} className="text-white" />
          </div>
          <span className="font-black text-slate-800 tracking-tight">Mes Courses Faciles</span>
        </Link>

        <div className="w-20" /> {/* Spacer */}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-slate-400 text-xs font-medium">
        &copy; 2026 Mes Courses Faciles. Tous droits réservés. Paiement sécurisé SSL.
      </footer>
    </div>
  );
}
