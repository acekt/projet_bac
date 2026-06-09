"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Loader2, Mail, Phone, Calendar, Search } from 'lucide-react';
import { User as UserType } from '@/types';

interface UserWithCount extends UserType {
    _count: {
        orders: number;
    }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
         const data = await res.json();
         setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Gestion des Clients</h1>
          <p className="text-slate-500">Consultez la liste des utilisateurs inscrits.</p>
        </div>
      </div>

      <Card className="p-4">
          <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  className="input-field pl-12 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Inscription</th>
                <th className="px-6 py-4 font-bold">Commandes</th>
                <th className="px-6 py-4 font-bold">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-slate-800">{user.name || 'Utilisateur anonyme'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Mail size={14} className="text-slate-400"/> {user.email}
                          </div>
                          {user.phone && (
                              <div className="flex items-center gap-2 text-slate-600 text-sm">
                                  <Phone size={14} className="text-slate-400"/> {user.phone}
                              </div>
                          )}
                      </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="font-bold text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full text-sm">
                         {user._count.orders}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                  Aucun client trouvé.
              </div>
          )}
        </Card>
      )}
    </div>
  );
}
