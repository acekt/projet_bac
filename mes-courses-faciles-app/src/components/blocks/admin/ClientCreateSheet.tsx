"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, Key } from 'lucide-react';
import { createUserAction } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';

// Zod validation schema matching the server action schema
const clientFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe provisoire doit contenir au moins 6 caractères"),
  role: z.enum(["CLIENT", "ADMIN"]),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientCreateSheet({ isOpen, onClose, onSuccess }: ClientCreateSheetProps) {
  const toast = useToast();

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CLIENT',
    }
  });

  // Reset form state on open/close
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Helper to generate a random temporary password
  const generateTempPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', password, { shouldValidate: true });
    toast.success("Mot de passe provisoire généré.");
  };

  const onSubmit = async (data: ClientFormValues) => {
    try {
      const result = await createUserAction(data);

      if (result.success) {
        toast.success(`Le compte de ${data.name} a été créé avec succès.`);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Impossible de créer l'utilisateur.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Une erreur réseau est survenue.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="sm:max-w-xl w-full sm:w-[600px] bg-slate-50/95 dark:bg-slate-950/90 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 shadow-2xl flex flex-col h-full p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <SheetTitle className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <UserPlus size={24} className="text-brand-primary" /> Nouveau Client / Admin
          </SheetTitle>
          <SheetDescription className="text-slate-500 dark:text-slate-400">
            Créez manuellement un compte utilisateur ou administrateur MCF.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Nom complet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                Nom complet
              </label>
              <input 
                {...register('name')}
                placeholder="Ex: Jules César"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-slate-850 dark:text-white font-medium text-sm"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs text-red-550 font-semibold"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                Adresse Email
              </label>
              <input 
                {...register('email')}
                type="email"
                placeholder="Ex: jules@mcf.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-slate-850 dark:text-white font-medium text-sm"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs text-red-550 font-semibold"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Mot de passe provisoire */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest flex justify-between items-center">
                <span>Mot de passe provisoire</span>
                <button 
                  type="button" 
                  onClick={generateTempPassword}
                  className="text-[10px] text-brand-primary hover:text-brand-primary-hover font-black flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <Key size={10} /> Générer
                </button>
              </label>
              <input 
                {...register('password')}
                placeholder="Saisissez ou générez un mot de passe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-slate-850 dark:text-white font-mono text-sm"
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs text-red-550 font-semibold"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Rôle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                Rôle de l&apos;utilisateur
              </label>
              <select 
                {...register('role')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-slate-800 dark:text-white font-medium text-sm"
              >
                <option value="CLIENT">Client (MCF Client)</option>
                <option value="ADMIN">Administrateur (Super Admin)</option>
              </select>
              <AnimatePresence>
                {errors.role && (
                  <motion.p 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs text-red-550 font-semibold"
                  >
                    {errors.role.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 z-10 flex-shrink-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="h-12 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Création...
                </>
              ) : (
                'Créer le compte'
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
