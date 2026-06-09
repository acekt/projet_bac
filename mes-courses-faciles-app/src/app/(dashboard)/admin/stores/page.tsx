"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Loader2, Store as StoreIcon, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { createStoreAction, updateStoreStatusAction } from '@/actions/ecommerce';
import { Store as StoreType } from '@/types';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stores');
      const data = await res.json();
      setStores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'mes-courses-faciles/stores');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setLogoUrl(data.url);
      } else {
        alert(data.error || 'Erreur lors du téléchargement de l\'image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (logoUrl) {
      data.logo = logoUrl;
    }

    try {
      const res = await createStoreAction(data as any);
      if (res.success) {
        setShowForm(false);
        setLogoUrl('');
        fetchStores();
      } else {
        alert(res.error);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (storeId: string, currentStatus: boolean) => {
      try {
          const res = await updateStoreStatusAction(storeId, !currentStatus);
          if (res.success) {
              fetchStores();
          } else {
              alert(res.error);
          }
      } catch (e: any) {
          alert(e.message);
      }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Gestion des Magasins</h1>
          <p className="text-slate-500">Ajoutez et gérez les magasins partenaires.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setLogoUrl(''); }} className="gap-2">
          <Plus size={20} /> Nouveau Magasin
        </Button>
      </div>

      {showForm && (
        <Card className="p-8 animate-in">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Ajouter un magasin</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Nom du magasin</label>
              <input name="name" className="input-field" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Quartier (District)</label>
              <input name="district" className="input-field" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Adresse complète</label>
              <input name="address" className="input-field" required />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Téléphone</label>
              <input name="phone" className="input-field" required placeholder="+241 66 00 00 00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Logo</label>
              <div className="flex items-center gap-4">
                 <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16} />}
                    {uploadingImage ? 'Téléchargement...' : 'Choisir une image'}
                 </Button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                 />
                 {logoUrl && (
                     <div className="w-10 h-10 rounded overflow-hidden border border-slate-200">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                     </div>
                 )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Description</label>
              <textarea name="description" className="input-field h-32 resize-none" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" disabled={submitting || uploadingImage}>
                {submitting ? <Loader2 className="animate-spin" /> : 'Enregistrer le magasin'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Magasin</th>
                <th className="px-6 py-4 font-bold">Quartier</th>
                <th className="px-6 py-4 font-bold">Téléphone</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                          {s.logo ? (
                               // eslint-disable-next-line @next/next/no-img-element
                               <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                              <StoreIcon size={20} />
                          )}
                      </div>
                      <span className="font-bold text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.district}</td>
                  <td className="px-6 py-4 text-slate-600">{s.phone}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(s.id, s.isActive)} className="focus:outline-none">
                        {s.isActive ? (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-green-100 text-green-600">
                                <CheckCircle size={12} /> Actif
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-red-100 text-red-600">
                                <XCircle size={12} /> Inactif
                            </span>
                        )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-brand-primary transition-colors"><Edit2 size={18} /></button>
                      {/* TODO: Add soft delete or check if it has products before delete */}
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
