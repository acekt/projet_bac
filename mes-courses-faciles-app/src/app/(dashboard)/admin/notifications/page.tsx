"use client";

import React, { useState, useEffect } from 'react';
import { BackButton } from '@/components/common/BackButton';
import { useToast } from '@/context/ToastContext';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction
} from '@/actions/admin';
import {
  Bell,
  ShoppingBag,
  Package,
  Trash2,
  Check,
  Loader2,
  Inbox,
  AlertCircle
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
  AlertDialogTrigger,
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

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittingAll, setSubmittingAll] = useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/notifications?all=true');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.alerts || []);
      } else {
        toast.error("Impossible de récupérer les notifications.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Une erreur est survenue lors du chargement des notifications.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setSubmittingId(id);
      const res = await markNotificationAsReadAction(id);
      if (res.success) {
        toast.success("Notification marquée comme lue.");
        // Optimistic update
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setSubmittingAll(true);
      const res = await markAllNotificationsAsReadAction();
      if (res.success) {
        toast.success("Toutes les notifications ont été marquées comme lues.");
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmittingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmittingId(id);
      const res = await deleteNotificationAction(id);
      if (res.success) {
        toast.success("Notification supprimée avec succès.");
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        toast.error(res.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden space-y-6 animate-in relative">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <BackButton href="/admin" label="Tableau de bord" />
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={submittingAll}
            variant="outline"
            className="w-full sm:w-auto font-bold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 active:scale-95 transition-all gap-2 cursor-pointer"
          >
            {submittingAll ? (
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
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Consultez et gérez les alertes système en temps réel, notamment les commandes en attente et les ruptures de stock.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Toutes ({notifications.length})
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-450 dark:text-slate-500">
            <Loader2 size={32} className="animate-spin text-brand-primary" />
            <span className="text-sm font-bold">Chargement des notifications...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.isRead;
            const isSubmitting = submittingId === notif.id;

            return (
              <div
                key={notif.id}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  isUnread
                    ? 'bg-blue-50/10 border-blue-500/20 shadow-sm dark:bg-blue-950/5 dark:border-blue-950/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-55/30 dark:hover:bg-slate-800/20'
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
                      : 'text-slate-600 dark:text-slate-400'
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
                      disabled={isSubmitting}
                      className="text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
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

                  {/* AlertDialog-protected destructive deletion */}
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isSubmitting}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
                          title="Supprimer la notification"
                        />
                      }
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-extrabold text-slate-900 dark:text-white text-lg">
                          Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-450 text-sm mt-2">
                          Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6 flex justify-end gap-3">
                        <AlertDialogCancel 
                          variant="outline" 
                          className="font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          variant="destructive" 
                          className="font-bold cursor-pointer"
                          onClick={() => handleDelete(notif.id)}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
    </div>
  );
}
