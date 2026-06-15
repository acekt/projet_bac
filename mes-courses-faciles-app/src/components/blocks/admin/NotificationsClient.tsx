"use client";

import React, { useState, useOptimistic, useTransition } from 'react';
import { BackButton } from '@/components/common/BackButton';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction
} from '@/actions/admin';
import {
  ShoppingBag,
  Package,
  Trash2,
  Check,
  Loader2,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface Notification {
  id: string;
  type: string;
  message: string;
  reference: string;
  isRead: boolean;
  createdAt: string;
}

type FilterType = 'ALL' | 'UNREAD' | 'READ';

interface NotificationsClientProps {
  initialNotifications: Notification[];
}

export default function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const toast = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  // Optimistic UI State
  const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
    initialNotifications,
    (state, action: 
      | { type: 'markRead'; id: string }
      | { type: 'markAllRead' }
      | { type: 'delete'; id: string }
    ) => {
      switch (action.type) {
        case 'markRead':
          return state.map(n => n.id === action.id ? { ...n, isRead: true } : n);
        case 'markAllRead':
          return state.map(n => ({ ...n, isRead: true }));
        case 'delete':
          return state.filter(n => n.id !== action.id);
        default:
          return state;
      }
    }
  );

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      setOptimisticNotifications({ type: 'markRead', id });
      try {
        const res = await markNotificationAsReadAction(id);
        if (res.success) {
          toast.success("Notification marquée comme lue.");
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la mise à jour.");
        }
      } catch (err) {
        toast.error("Une erreur est survenue.");
      }
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      setOptimisticNotifications({ type: 'markAllRead' });
      try {
        const res = await markAllNotificationsAsReadAction();
        if (res.success) {
          toast.success("Toutes les notifications ont été marquées comme lues.");
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la mise à jour.");
        }
      } catch (err) {
        toast.error("Une erreur est survenue.");
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      setOptimisticNotifications({ type: 'delete', id });
      try {
        const res = await deleteNotificationAction(id);
        if (res.success) {
          toast.success("Notification supprimée avec succès.");
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la suppression.");
        }
      } catch (err) {
        toast.error("Une erreur est survenue.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const filteredNotifications = optimisticNotifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = optimisticNotifications.filter(n => !n.isRead).length;
  const readCount = optimisticNotifications.filter(n => n.isRead).length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden space-y-6 animate-in relative">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <BackButton href="/admin" label="Tableau de bord" />
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            variant="outline"
            className="w-full sm:w-auto font-bold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 active:scale-95 transition-all gap-2 cursor-pointer"
          >
            {isPending && !deletingId ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} strokeWidth={2.5} />
            )}
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Main title & Info */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Centre de Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="text-slate-550 dark:text-slate-400 text-sm font-medium">
          Consultez et gérez les alertes système en temps réel, notamment les commandes en attente et les ruptures de stock.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 flex-shrink-0">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Toutes ({optimisticNotifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'UNREAD'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Non lues ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('READ')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'READ'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Lues ({readCount})
        </button>
      </div>

      {/* Notifications List Wrapper */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.isRead;
            const isSubmitting = isPending && deletingId === null; // Loader for marking individual as read
            const isDeleting = isPending && deletingId === notif.id;

            return (
              <div
                key={notif.id}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  isUnread
                    ? 'bg-blue-50/10 border-blue-500/20 shadow-sm dark:bg-blue-950/5 dark:border-blue-950/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/20'
                }`}
              >
                {/* Visual Icon indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  {notif.type === 'ORDER' ? (
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 flex items-center justify-center">
                      <ShoppingBag size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center">
                      <Package size={20} />
                    </div>
                  )}
                </div>

                {/* Message & Meta */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md ${
                      notif.type === 'ORDER'
                        ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {notif.type === 'ORDER' ? 'Commande' : 'Stock'}
                    </span>
                    {isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isUnread
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'text-slate-650 dark:text-slate-400 font-medium'
                  }`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold font-mono">
                    {new Date(notif.createdAt).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-center">
                  {isUnread && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(notif.id)}
                      disabled={isPending}
                      className="text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer h-9 px-3 rounded-lg"
                      title="Marquer comme lue"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} strokeWidth={2.5} />
                      )}
                      <span className="hidden sm:inline ml-1.5">Marquer lue</span>
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => {
                      setNotificationToDelete(notif);
                      setIsDeleteAlertOpen(true);
                    }}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer h-9 w-9 rounded-lg"
                    title="Supprimer la notification"
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
              <Inbox size={28} />
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-800 dark:text-white text-lg">
                Aucune alerte trouvée
              </p>
              <p className="text-sm text-slate-450 dark:text-slate-500 max-w-sm">
                {filter === 'ALL'
                  ? "Vous n'avez reçu aucune notification pour le moment."
                  : filter === 'UNREAD'
                  ? "Toutes vos notifications ont été lues !"
                  : "Vous n'avez pas encore de notifications lues."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="font-extrabold text-slate-900 dark:text-white text-lg">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-450 text-sm mt-2">
              Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel 
              onClick={() => { setIsDeleteAlertOpen(false); setNotificationToDelete(null); }}
              className="font-bold border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 cursor-pointer h-11 px-5 rounded-xl"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (notificationToDelete) {
                  handleDelete(notificationToDelete.id);
                  setIsDeleteAlertOpen(false);
                }
              }}
              className="font-bold cursor-pointer h-11 px-5 rounded-xl bg-red-650 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
