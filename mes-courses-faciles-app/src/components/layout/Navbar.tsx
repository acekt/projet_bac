import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
            🛒 Mes Courses Faciles
          </Link>
        </div>

        <div className="flex-1 max-w-xl w-full flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-green-500 focus-within:bg-white transition-all">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un produit (ex: Riz, Lait...)"
            className="bg-transparent border-none outline-none w-full px-3 text-gray-700"
          />
          <button className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            Rechercher
          </button>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline font-medium text-sm">S'identifier</span>
          </Link>
          <Link href="/cart" className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-100 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span>0 CFA</span>
          </Link>
        </div>
      </div>

      <nav className="bg-slate-800 text-white overflow-x-auto">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between whitespace-nowrap">
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/category/alimentaire" className="hover:text-green-400 transition-colors">Produits Alimentaires</Link>
            <Link href="/category/nettoyage" className="hover:text-green-400 transition-colors">Produits de Nettoyage</Link>
          </div>
          <div className="flex items-center gap-2 text-sm ml-6">
            <span>🛒 Magasin :</span>
            <select className="bg-slate-700 text-white rounded px-2 py-1 outline-none border border-slate-600 focus:border-green-500">
              <option>Mbolo</option>
              <option>Prix Import</option>
              <option>Sangel</option>
              <option>Cécado</option>
              <option>Gaboprix</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
