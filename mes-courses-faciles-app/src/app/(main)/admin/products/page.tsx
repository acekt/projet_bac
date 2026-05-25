"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Edit2, Loader2, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Record<string, any>[]>([]);
  const [stores, setStores] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, storeRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/stores')
      ]);
      setProducts(await prodRes.json());
      setStores(await storeRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images: [data.image]
        })
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Gestion du Catalogue</h1>
          <p className="text-slate-500">Ajoutez et gérez les produits de vos magasins.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} /> Nouveau Produit
        </Button>
      </div>

      {showForm && (
        <Card className="p-8 animate-in" isHoverable={false}>
          <h2 className="text-xl font-bold mb-6 text-slate-800">Ajouter un produit</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Nom du produit</label>
              <input name="name" className="input-field" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Magasin</label>
              <select name="storeId" className="input-field" required>
                <option value="">Sélectionner un magasin</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Prix (CFA)</label>
              <input name="price" type="number" className="input-field" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Stock</label>
              <input name="stock" type="number" className="input-field" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Catégorie</label>
              <select name="category" className="input-field" required>
                <option value="Alimentaire">Alimentaire</option>
                <option value="Nettoyage">Nettoyage</option>
                <option value="Hygiène">Hygiène</option>
                <option value="Boissons">Boissons</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Unité (ex: sac, kg, pack)</label>
              <input name="unit" className="input-field" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">URL de l&apos;image</label>
              <input name="image" className="input-field" required placeholder="https://..." />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Description</label>
              <textarea name="description" className="input-field h-32 resize-none" required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : 'Enregistrer le produit'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>
      ) : (
        <Card className="overflow-hidden p-0" isHoverable={false}>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Produit</th>
                <th className="px-6 py-4 font-bold">Magasin</th>
                <th className="px-6 py-4 font-bold">Prix</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.store?.name}</td>
                  <td className="px-6 py-4 font-bold text-brand-secondary">{p.price.toLocaleString()} CFA</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-brand-primary transition-colors"><Edit2 size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
