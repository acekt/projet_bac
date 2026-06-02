"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Edit2, Loader2, Package } from 'lucide-react';
import { createProductAction } from '@/actions/ecommerce';
import { Product as ProductType, Store as StoreType } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Record<string, any> | null>(null);

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

  const handleEdit = (product: Record<string, any>) => {
    // Extract single image URL from JSON array string if needed
    let imageUrl = '';
    try {
      const parsedImages = JSON.parse(product.images);
      imageUrl = parsedImages[0] || '';
    } catch (e) {
      imageUrl = product.images || '';
    }

    setEditingProduct({
      ...product,
      image: imageUrl
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchData();
        } else {
          alert('Erreur lors de la suppression du produit');
        }
      } catch (e) {
        console.error(e);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}` 
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image: data.image
        })
      });
      if (res.ok) {
        setShowForm(false);
        setEditingProduct(null);
        fetchData();
      } else {
        const errData = await res.json();
        alert(`Erreur: ${errData.error || 'Soumission échouée'}`);
      }
    } catch (e: any) {
      console.error(e);
      alert('Erreur réseau lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Gestion du Catalogue</h1>
          <p className="text-slate-500">Ajoutez et gérez les produits de vos magasins.</p>
        </div>
        <Button onClick={() => { if (showForm && editingProduct) { handleCancel(); } else { setShowForm(!showForm); } }} className="gap-2">
          <Plus size={20} /> {editingProduct ? 'Mode Édition' : 'Nouveau Produit'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-8 animate-in" isHoverable={false}>
          <h2 className="text-xl font-bold mb-6 text-slate-800">
            {editingProduct ? `Modifier le produit: ${editingProduct.name}` : 'Ajouter un produit'}
          </h2>
          <form key={editingProduct ? editingProduct.id : 'new'} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Nom du produit</label>
              <input name="name" className="input-field" required defaultValue={editingProduct?.name || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Magasin</label>
              <select name="storeId" className="input-field" required defaultValue={editingProduct?.storeId || ''}>
                <option value="">Sélectionner un magasin</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Prix (CFA)</label>
              <input name="price" type="number" className="input-field" required defaultValue={editingProduct?.price || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Stock</label>
              <input name="stock" type="number" className="input-field" required defaultValue={editingProduct?.stock || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Catégorie</label>
              <select name="category" className="input-field" required defaultValue={editingProduct?.category || 'Alimentaire'}>
                <option value="Alimentaire">Alimentaire</option>
                <option value="Nettoyage">Nettoyage</option>
                <option value="Hygiène">Hygiène</option>
                <option value="Boissons">Boissons</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Unité (ex: sac, kg, pack)</label>
              <input name="unit" className="input-field" required defaultValue={editingProduct?.unit || ''} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">URL de l&apos;image</label>
              <input name="image" className="input-field" required placeholder="https://..." defaultValue={editingProduct?.image || ''} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Description</label>
              <textarea name="description" className="input-field h-32 resize-none" required defaultValue={editingProduct?.description || ''} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={handleCancel}>Annuler</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : editingProduct ? 'Enregistrer les modifications' : 'Enregistrer le produit'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>
      ) : (
        <Card className="overflow-hidden p-0" isHoverable={false}>
          <div className="overflow-x-auto">
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      Aucun produit dans le catalogue. Cliquez sur "Nouveau Produit" pour commencer.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            <Package size={20} />
                          </div>
                          <span className="font-bold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{p.store?.name || 'Inconnu'}</td>
                      <td className="px-6 py-4 font-bold text-brand-secondary">{p.price.toLocaleString()} CFA</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(p)}
                            className="p-2 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
