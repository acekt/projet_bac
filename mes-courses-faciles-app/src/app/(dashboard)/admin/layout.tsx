"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  Store,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { markAllNotificationsAsReadAction, markNotificationAsReadAction } from '@/actions/admin';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '/admin' },
  { icon: Store, label: 'Magasins', href: '/admin/stores' },
  { icon: Package, label: 'Catalogue', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Commandes', href: '/admin/orders' },
  { icon: Users, label: 'Clients', href: '/admin/users' },
  { icon: BarChart3, label: 'Analytiques', href: '/admin/analytics' },
  { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();
  const toast = useToast();
  
  const [notifications, setNotifications] = useState<{ hasUnread: boolean; hasBadge: boolean; alerts: any[] }>({
    hasUnread: false,
    hasBadge: false,
    alerts: []
  });
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAllNotificationsAsReadAction();
      if (res.success) {
        toast.success("Toutes les notifications ont été marquées comme lues.");
        fetchNotifications();
      } else {
        toast.error(res.error || "Erreur lors du marquage des notifications.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsReadAction(id);
      if (res.success) {
        fetchNotifications();
      } else {
        toast.error(res.error || "Erreur lors du marquage de la notification.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50">
      {/* Mobile Sidebar Backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 h-full overflow-y-auto bg-brand-secondary text-white transition-all duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 gap-4 border-b border-white/10 flex-shrink-0">
            <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={20} />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg whitespace-nowrap">Admin MCF</span>
            )}
            <button className="lg:hidden ml-auto p-1.5 hover:bg-white/10 rounded-lg cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                    ${isActive ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isSidebarOpen && (
                    <span className="font-medium flex-1 text-sm">{item.label}</span>
                  )}
                  {isActive && isSidebarOpen && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
             <button
               onClick={logout}
               className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm cursor-pointer"
             >
               <LogOut size={20} />
               {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2 text-slate-400 hover:text-brand-primary cursor-pointer transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
                {(notifications.hasUnread || notifications.hasBadge) && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
                  </>
                )}
              </button>
              
              <AnimatePresence>
                {isNotifDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsNotifDropdownOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-white">Alertes du Centre de Contrôle</span>
                        {(notifications.hasUnread || notifications.hasBadge) && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-brand-primary hover:underline font-bold cursor-pointer"
                          >
                            Tout lire
                          </button>
                        )}
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                        {notifications.alerts.length > 0 ? (
                          notifications.alerts.map((alert) => {
                            const isUnread = !alert.isRead;
                            return (
                              <div
                                key={alert.id}
                                onClick={() => isUnread && handleMarkAsRead(alert.id)}
                                className={`p-4 transition-colors flex gap-3 cursor-pointer ${
                                  isUnread 
                                    ? 'bg-blue-50/20 hover:bg-blue-50/40 dark:bg-blue-950/10 dark:hover:bg-blue-950/20' 
                                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <div className="mt-0.5">
                                  {alert.type === 'ORDER' ? (
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                                      <ShoppingBag size={16} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                      <Package size={16} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                  <span className={`text-xs leading-normal ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {alert.message}
                                  </span>
                                  <span className="text-[10px] text-slate-450 font-semibold font-mono">
                                    {new Date(alert.createdAt).toLocaleString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      day: '2-digit',
                                      month: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {isUnread && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-slate-450 dark:text-slate-500 text-xs font-bold flex flex-col items-center gap-2">
                            <span className="text-xl">🎉</span>
                            <span>Aucune alerte en attente</span>
                            <span className="text-[10px] text-slate-450 font-normal">Toutes les commandes sont traitées et les stocks sont OK.</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 text-center">
                        <Link
                          href="/admin/notifications"
                          onClick={() => setIsNotifDropdownOpen(false)}
                          className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors inline-flex items-center gap-1"
                        >
                          Voir toutes les notifications
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-800 leading-none">Admin Jules</p>
                 <p className="text-xs text-slate-500 mt-1">Super Admin</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                 J
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-h-0 p-6 md:p-8 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
