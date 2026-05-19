import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

const STATS = [
  { label: 'Ventes du jour', value: '450 000 CFA', change: '+12.5%', isUp: true, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { label: 'Commandes', value: '24', change: '+3', isUp: true, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { label: 'Nouveaux clients', value: '18', change: '-2', isUp: false, icon: Users, color: 'bg-purple-100 text-purple-600' },
  { label: 'Livrées', value: '12', change: '+8%', isUp: true, icon: Truck, color: 'bg-orange-100 text-orange-600' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">Vue d&apos;ensemble</h1>
        <p className="text-slate-500">Bienvenue, voici ce qui se passe aujourd&apos;hui.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <Card key={i} className="p-6" isHoverable={false}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-8" isHoverable={false}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Commandes récentes</h3>
            <button className="text-brand-primary text-sm font-bold hover:underline">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 font-bold">Commande</th>
                  <th className="pb-4 font-bold">Client</th>
                  <th className="pb-4 font-bold">Magasin</th>
                  <th className="pb-4 font-bold">Total</th>
                  <th className="pb-4 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { id: '#MCF-102', client: 'Marc Owono', store: 'Mbolo', total: '12 500 CFA', status: 'En préparation', color: 'text-orange-500 bg-orange-50' },
                  { id: '#MCF-101', client: 'Sarah B.', store: 'Géant Casino', total: '45 000 CFA', status: 'En livraison', color: 'text-blue-500 bg-blue-50' },
                  { id: '#MCF-100', client: 'Idriss M.', store: 'Prix Import', total: '8 900 CFA', status: 'Livré', color: 'text-green-500 bg-green-50' },
                  { id: '#MCF-099', client: 'Marie L.', store: 'Mbolo', total: '21 000 CFA', status: 'Annulé', color: 'text-red-500 bg-red-50' },
                ].map((order, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-800">{order.id}</td>
                    <td className="py-4 text-slate-600">{order.client}</td>
                    <td className="py-4 text-slate-600">{order.store}</td>
                    <td className="py-4 font-bold text-brand-secondary">{order.total}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.color}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-8" isHoverable={false}>
          <h3 className="text-xl font-bold text-slate-800 mb-6">Activité</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-800">
                    <span className="font-bold">Nouveau stock</span> ajouté pour le produit &quot;Riz 5kg&quot; chez Mbolo.
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Il y a 10 min</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
