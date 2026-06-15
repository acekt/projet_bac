"use client";

import React, { useState, useOptimistic, useTransition } from 'react';
import { Loader2, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { User as UserType } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ClientCreateSheet } from '@/components/blocks/admin/ClientCreateSheet';
import { updateUserStatusAction } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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

interface UserWithCount extends Omit<UserType, 'createdAt'> {
  createdAt: string | Date;
  _count: {
    orders: number;
  };
  isActive: boolean;
}

interface AdminUsersClientProps {
  initialUsers: UserWithCount[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const isCreateOpen = searchParams.get('new') === 'client';

  const setIsCreateOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set('new', 'client');
    } else {
      params.delete('new');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<UserWithCount | null>(null);

  // Optimistic UI State
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    initialUsers,
    (state, action: { type: 'toggle'; id: string; isActive: boolean }) => {
      switch (action.type) {
        case 'toggle':
          return state.map(u => u.id === action.id ? { ...u, isActive: action.isActive } : u);
        default:
          return state;
      }
    }
  );

  const handleToggleClick = (user: UserWithCount) => {
    setUserToToggle(user);
    setIsConfirmOpen(true);
  };

  const handleToggleConfirm = () => {
    if (!userToToggle) return;
    const user = userToToggle;
    const targetState = !user.isActive;
    setIsConfirmOpen(false);
    setUserToToggle(null);

    startTransition(async () => {
      // Apply optimistic update
      setOptimisticUsers({ type: 'toggle', id: user.id, isActive: targetState });
      try {
        const res = await updateUserStatusAction(user.id, targetState);
        if (res.success) {
          toast.success(
            targetState 
              ? `Le compte de ${user.name || user.email} a été réactivé.` 
              : `Le compte de ${user.name || user.email} a été suspendu.`
          );
          router.refresh();
        } else {
          toast.error(res.error || "Une erreur est survenue lors de la modification d'accès.");
        }
      } catch (err: any) {
        toast.error("Une erreur réseau est survenue.");
      }
    });
  };

  const handleSuccess = () => {
    router.refresh();
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
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              <Mail size={13} className="text-slate-450 dark:text-slate-500 flex-shrink-0"/> {user.email}
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-slate-650 dark:text-slate-400 text-xs font-mono font-bold">
                <Phone size={13} className="text-slate-450 dark:text-slate-500 flex-shrink-0"/> {user.phone}
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Inscription',
      cell: ({ row }) => {
        const dateStr = typeof row.original.createdAt === 'string'
          ? row.original.createdAt
          : (row.original.createdAt as Date).toISOString();
        return (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-semibold">
            <Calendar size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
            {new Date(dateStr).toLocaleDateString('fr-FR')}
          </div>
        );
      }
    },
    {
      accessorKey: '_count.orders',
      header: 'Commandes',
      cell: ({ row }) => (
        <span className="font-bold text-brand-secondary dark:text-emerald-400 bg-brand-secondary/5 dark:bg-emerald-950/20 px-3 py-1 rounded-full text-xs border border-brand-secondary/10 dark:border-emerald-900/30">
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
            disabled={isPending}
            className="focus:outline-none cursor-pointer flex items-center gap-1.5 group/btn disabled:opacity-60"
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
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <DataTable 
        columns={columns} 
        data={optimisticUsers} 
        searchPlaceholder="Rechercher par nom, email, téléphone, rôle..." 
      />

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
              disabled={isPending}
              className={`h-11 px-5 rounded-xl font-bold text-white shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                userToToggle?.isActive 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              }`}
            >
              {isPending ? (
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
