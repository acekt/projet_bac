export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6">Modes de Paiement</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Airtel Money', 'Moov Money', 'Mobicash', 'Carte Bancaire'].map((mode) => (
              <span key={mode} className="bg-slate-700 px-4 py-2 rounded-md text-sm font-medium border border-slate-600">
                {mode}
              </span>
            ))}
            <span className="bg-green-600 px-4 py-2 rounded-md text-sm font-medium border border-green-500">
              Paiement à la Livraison
            </span>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-slate-400 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Mes Courses Faciles - Tous droits réservés.</p>
          <p>Note : L'authentification est obligatoire pour finaliser la commande.</p>
        </div>
      </div>
    </footer>
  );
}
