"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Loader2, Mail, Phone, Calendar, CheckCircle, XCircle, Plus, ToggleLeft } from 'lucide-react';
import { User as UserType } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ClientCreateSheet } from '@/components/blocks/admin/ClientCreateSheet';
import { updateUserStatusAction } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithCount extends UserType {
  _count: {
    orders: number;
  };
  isActive: boolean;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<UserWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const toast = useToast();

  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<UserWithCount | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Erreur lors du chargement des utilisateurs.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Impossible de récupérer les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleClick = (user: UserWithCount) => {
    setUserToToggle(user);
    setIsConfirmOpen(true);
  };

  const handleToggleConfirm = async () => {
    if (!userToToggle) return;
    setToggling(true);
    try {
      const targetState = !userToToggle.isActive;
      const res = await updateUserStatusAction(userToToggle.id, targetState);
      if (res.success) {
        toast.success(
          targetState 
            ? `Le compte de ${userToToggle.name || userToToggle.email} a été réactivé.` 
            : `Le compte de ${userToToggle.name || userToToggle.email} a été suspendu.`
        );
        fetchUsers();
      } else {
        toast.error(res.error || "Une erreur est survenue lors de la modification d'accès.");
      }
    } catch (err: any) {
      toast.error("Une erreur réseau est survenue.");
    } finally {
      setToggling(false);
      setIsConfirmOpen(false);
      setUserToToggle(null);
    }
  };

  const handleSuccess = () => {
    fetchUsers();
  };

  const columns: ColumnDef<UserWithCount>[] = [
    {
      accessorKey: 'name',
      header: 'Client',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.name || 'Utilisateur anonyme'}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-650 dark:text-slate-400 text-xs font-semibold">
              <Mail size={13} className="text-slate-400 dark:text-slate-500 flex-shrink-0"/> {user.email}
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-slate-655 dark:text-slate-400 text-xs font-mono font-bold">
                <Phone size={13} className="text-slate-400 dark:text-slate-500 flex-shrink-0"/> {user.phone}
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Inscription',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-semibold">
          <Calendar size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
          {new Date(row.original.createdAt).toLocaleDateString('fr-FR')}
        </div>
      )
    },
    {
      accessorKey: '_count.orders',
      header: 'Commandes',
      cell: ({ row }) => (
        <span className="font-bold text-brand-secondary dark:text-emerald-450 bg-brand-secondary/5 dark:bg-emerald-950/20 px-3 py-1 rounded-full text-xs border border-brand-secondary/10 dark:border-emerald-900/30">
          {row.original._count?.orders || 0} commande{ (row.original._count?.orders || 0) > 1 ? 's' : ''}
        </span>
      )
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => {
        const isAdmin = row.original.role === 'ADMIN';
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isAdmin 
              ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/50' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200/50 dark:border-slate-700/50'
          }`}>
            {row.original.role}
          </span>
        );
      }
    },
    {
      accessorKey: 'isActive',
      header: 'Statut / Accès',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <button 
            onClick={() => handleToggleClick(user)} 
            className="focus:outline-none cursor-pointer flex items-center gap-1.5 group/btn"
            title="Cliquez pour modifier l'accès"
          >
            {user.isActive ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-250/30 transition-all group-hover/btn:border-emerald-500">
                <CheckCircle size={12} /> Actif
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-250/30 transition-all group-hover/btn:border-rose-500">
                <XCircle size={12} /> Suspendu
              </span>
            )}
          </button>
        );
      }
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-8 animate-in relative overflow-hidden">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-550 dark:text-slate-400 font-bold">Clients</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="text-brand-primary" size={28} /> Gestion des Clients
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Consultez, créez et gérez les droits d&apos;accès des utilisateurs MCF.</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)} 
          className="gap-2 h-11 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer transition-all"
        >
          <Plus size={20} /> Nouveau Client
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={users} 
          searchPlaceholder="Rechercher par nom, email, téléphone, rôle..." 
        />
      )}

      {/* Slide-out client creation sheet */}
      <ClientCreateSheet 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Confirm user status change */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl font-black text-slate-800 dark:text-white">
              {userToToggle?.isActive ? "Suspendre le compte ?" : "Activer le compte ?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
              {userToToggle?.isActive ? (
                <>
                  Êtes-vous sûr de vouloir suspendre le compte de <strong className="text-slate-700 dark:text-slate-200">{userToToggle?.name || userToToggle?.email}</strong> ?
                  Cette personne ne pourra plus se connecter ou passer de commandes sur MCF.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir réactiver le compte de <strong className="text-slate-700 dark:text-slate-200">{userToToggle?.name || userToToggle?.email}</strong> ?
                  Cette personne retrouvera immédiatement ses accès de connexion.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel 
              onClick={() => { setIsConfirmOpen(false); setUserToToggle(null); }}
              className="h-11 px-5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleConfirm}
              disabled={toggling}
              className={`h-11 px-5 rounded-xl font-bold text-white shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                userToToggle?.isActive 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              }`}
            >
              {toggling ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Modification...
                </>
              ) : (
                userToToggle?.isActive ? 'Suspendre' : 'Activer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    }>
      <AdminUsersContent />
    </Suspense>
  );
}
