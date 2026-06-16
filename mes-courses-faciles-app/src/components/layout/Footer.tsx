import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-24 lg:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-primary">Mes Courses Faciles</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              La première plateforme e-commerce au Gabon qui vous connecte directement à vos magasins préférés.
            </p>
            <div className="flex gap-4">
              {[
                { s: 'FB', href: 'https://facebook.com/mesachats241' },
                { s: 'IG', href: 'https://instagram.com/mesachats241' },
                { s: 'TW', href: 'https://twitter.com/mesachats241' }
              ].map(item => (
                <a 
                  key={item.s} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-white decoration-none font-bold text-xs"
                >
                  {item.s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>
                <Link href="/#magasins" className="hover:text-white transition-colors">
                  Tous les magasins
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <a href="mailto:partenaires@mesachats241.com?subject=Partenariat" className="hover:text-white transition-colors">
                  Devenir partenaire
                </a>
              </li>

            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Aide</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>
                <a href="mailto:support@mesachats241.com?subject=Centre%20d'aide" className="hover:text-white transition-colors">
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <Link href="/profile?tab=orders" className="hover:text-white transition-colors">
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <a href="mailto:support@mesachats241.com?subject=Livraison%20et%20Retours" className="hover:text-white transition-colors">
                  Livraison & Retours
                </a>
              </li>
              <li>
                <a href="mailto:contact@mesachats241.com" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Paiement Sécurisé</h4>
            <div className="flex flex-wrap gap-2">
              {['Airtel Money', 'Moov Money', 'Mobicash', 'Carte Bancaire'].map((mode) => (
                <span key={mode} className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-slate-700">
                  {mode}
                </span>
              ))}
              <span className="bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-brand-primary/30">
                Paiement à la Livraison
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} Mes Courses Faciles - Fait avec passion à Libreville.</p>

        </div>
      </div>
    </footer>
  );
};
