import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Banner */}
      <section className="relative h-[400px] flex items-center justify-center text-white text-center">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80')"
          }}
        ></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Vos courses à domicile au Gabon</h1>
          <p className="text-xl max-w-2xl mx-auto">Sélectionnez votre magasin et faites-vous livrer sans vous déplacer.</p>
        </div>
      </section>

      {/* Featured Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Categories / Sections placeholder */}
        <section>
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-green-600 pl-4">Produits Alimentaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Bananes (Régime)', price: 1500, icon: '🍌' },
              { id: 2, name: 'Riz Parfumé (5kg)', price: 4500, icon: '🍚' },
              { id: 3, name: 'Lait de croissance', price: 2800, icon: '🥛' },
              { id: 4, name: 'Poulet Entier', price: 3200, icon: '🍗' },
            ].map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
                <div className="text-6xl h-32 flex items-center justify-center bg-gray-50 rounded-lg mb-4 group-hover:scale-105 transition-transform">
                  {p.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-green-600 font-bold text-xl mb-4">{p.price.toLocaleString()} CFA</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-green-600 pl-4">Produits de Nettoyage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: 5, name: 'Lave-Vaisselle (Liquide)', price: 1200, icon: '🧼' },
              { id: 6, name: 'Lessive en poudre', price: 2500, icon: '🧺' },
            ].map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
                <div className="text-6xl h-32 flex items-center justify-center bg-gray-50 rounded-lg mb-4 group-hover:scale-105 transition-transform">
                  {p.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-green-600 font-bold text-xl mb-4">{p.price.toLocaleString()} CFA</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
