"use client";

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Lock, 
  Sliders, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Info,
  Server,
  DollarSign,
  Bell,
  Phone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  updateAdminProfileAction, 
  updateAdminPasswordAction, 
  updatePlatformPreferencesAction 
} from "@/actions/admin";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

interface SettingsClientProps {
  initialProfile: {
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
  } | null;
  initialPreferences: {
    platformName: string;
    defaultDeliveryFee: number;
    maintenanceMode: boolean;
    enableEmailNotifications: boolean;
    supportContact: string;
  } | null;
}

export default function SettingsClient({
  initialProfile,
  initialPreferences
}: SettingsClientProps) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("profile");


  // States for Profile Form
  const [profileForm, setProfileForm] = useState({
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    phone: initialProfile?.phone || "",
    address: initialProfile?.address || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // States for Security Form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityError, setSecurityError] = useState("");

  // States for Platform Preferences Form
  const [preferencesForm, setPreferencesForm] = useState({
    platformName: initialPreferences?.platformName || "MesCoursesFaciles",
    defaultDeliveryFee: initialPreferences?.defaultDeliveryFee ?? 1000,
    maintenanceMode: initialPreferences?.maintenanceMode ?? false,
    enableEmailNotifications: initialPreferences?.enableEmailNotifications ?? true,
    supportContact: initialPreferences?.supportContact || "",
  });
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesSuccess, setPreferencesSuccess] = useState("");
  const [preferencesError, setPreferencesError] = useState("");

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const res = await updateAdminProfileAction(profileForm);
      if (res.success) {
        const msg = "Votre profil administrateur a été mis à jour avec succès.";
        setProfileSuccess(msg);
        toast.success(msg);
      } else {
        const errMsg = res.error || "Impossible de mettre à jour le profil.";
        setProfileError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      setProfileError("Une erreur inattendue est survenue.");
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySaving(true);
    setSecuritySuccess("");
    setSecurityError("");

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      const errMsg = "Le nouveau mot de passe et la confirmation ne correspondent pas.";
      setSecurityError(errMsg);
      toast.error(errMsg);
      setSecuritySaving(false);
      return;
    }

    try {
      const res = await updateAdminPasswordAction(securityForm);
      if (res.success) {
        const msg = "Votre mot de passe a été modifié avec succès.";
        setSecuritySuccess(msg);
        toast.success(msg);
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errMsg = res.error || "Impossible de modifier le mot de passe.";
        setSecurityError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      setSecurityError("Une erreur inattendue est survenue.");
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setSecuritySaving(false);
    }
  };

  // Handle Preferences Update
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesSaving(true);
    setPreferencesSuccess("");
    setPreferencesError("");

    try {
      const res = await updatePlatformPreferencesAction(preferencesForm);
      if (res.success) {
        const msg = "Les préférences de la plateforme ont été enregistrées.";
        setPreferencesSuccess(msg);
        toast.success(msg);
      } else {
        const errMsg = res.error || "Impossible d'enregistrer les préférences.";
        setPreferencesError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      setPreferencesError("Une erreur inattendue est survenue.");
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setPreferencesSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in duration-300 relative overflow-y-auto h-full pr-2 pb-6">
      {/* Page Header */}
      <div>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span>Admin</span>
          <span>/</span>
          <span className="text-slate-550 dark:text-slate-400 font-bold">Configuration</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="text-brand-primary" size={28} /> Configuration
        </h1>
        <p className="text-slate-550 dark:text-slate-400 font-medium">Gérez le profil, la sécurité et les préférences globales de la plateforme.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        {/* Navigation Tabs */}
        <TabsList className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl max-w-xl h-14 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
          <TabsTrigger 
            value="profile" 
            className="flex-1 rounded-xl text-xs sm:text-sm font-bold py-2.5 transition-all flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent cursor-pointer"
          >
            <User size={16} /> Profil Admin
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex-1 rounded-xl text-xs sm:text-sm font-bold py-2.5 transition-all flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent cursor-pointer"
          >
            <Lock size={16} /> Sécurité
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="flex-1 rounded-xl text-xs sm:text-sm font-bold py-2.5 transition-all flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent cursor-pointer"
          >
            <Sliders size={16} /> Préférences
          </TabsTrigger>
        </TabsList>

        <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl rounded-[2rem] shadow-xl">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Profile Settings Content */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="profile" keepMounted className="mt-0 outline-none space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <User className="text-brand-primary" size={20} /> Profil Administrateur
                      </h3>
                      <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold">
                        Configurez vos informations personnelles visibles par le système.
                      </p>
                    </div>

                    <hr className="border-slate-200/50 dark:border-slate-800/50" />

                    {profileSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <CheckCircle2 size={18} />
                        {profileSuccess}
                      </div>
                    )}
                    {profileError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <AlertCircle size={18} />
                        {profileError}
                      </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="profile-name" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Nom complet
                          </Label>
                          <Input
                            id="profile-name"
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            required
                            placeholder="Nom Admin"
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile-email" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Adresse Email
                          </Label>
                          <Input
                            id="profile-email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            required
                            placeholder="admin@email.com"
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile-phone" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Numéro de Téléphone
                          </Label>
                          <Input
                            id="profile-phone"
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="+241 XX XX XX XX"
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile-address" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Adresse Géographique
                          </Label>
                          <Input
                            id="profile-address"
                            type="text"
                            value={profileForm.address}
                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                            placeholder="Quartier, Ville, Gabon"
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                        <Button 
                          type="submit" 
                          disabled={profileSaving}
                          className="h-12 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {profileSaving ? (
                            <>
                              <Loader2 className="animate-spin" size={18} /> Enregistrement...
                            </>
                          ) : (
                            "Sauvegarder"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </motion.div>
              )}

              {/* Security settings content */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="security" keepMounted className="mt-0 outline-none space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Lock className="text-brand-primary" size={20} /> Sécurité du Compte
                      </h3>
                      <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold">
                        Modifiez votre mot de passe d&apos;accès administrateur.
                      </p>
                    </div>

                    <hr className="border-slate-200/50 dark:border-slate-800/50" />

                    {securitySuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <CheckCircle2 size={18} />
                        {securitySuccess}
                      </div>
                    )}
                    {securityError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <AlertCircle size={18} />
                        {securityError}
                      </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-5 max-w-xl">
                        <div className="space-y-2">
                          <Label htmlFor="current-password" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Mot de passe actuel
                          </Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              value={securityForm.currentPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                              required
                              className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 pl-4 pr-12 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="new-password" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Nouveau mot de passe
                            </Label>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                              <Info size={10} /> 1 Majuscule + 1 Chiffre min. (8 caract.)
                            </span>
                          </div>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              value={securityForm.newPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                              required
                              className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 pl-4 pr-12 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Confirmer le nouveau mot de passe
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={securityForm.confirmPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                              required
                              className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 pl-4 pr-12 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                        <Button 
                          type="submit" 
                          disabled={securitySaving}
                          className="h-12 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {securitySaving ? (
                            <>
                              <Loader2 className="animate-spin" size={18} /> Modification...
                            </>
                          ) : (
                            "Modifier le mot de passe"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </motion.div>
              )}

              {/* Preferences Settings Content */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="preferences" keepMounted className="mt-0 outline-none space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Sliders className="text-brand-primary" size={20} /> Préférences de la plateforme
                      </h3>
                      <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold">
                        Configurez le comportement global de l&apos;application MesCoursesFaciles.
                      </p>
                    </div>

                    <hr className="border-slate-200/50 dark:border-slate-800/50" />

                    {preferencesSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <CheckCircle2 size={18} />
                        {preferencesSuccess}
                      </div>
                    )}
                    {preferencesError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4">
                        <AlertCircle size={18} />
                        {preferencesError}
                      </div>
                    )}

                    <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="prefs-name" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Server size={14} className="text-slate-400" /> Nom de la plateforme
                          </Label>
                          <Input
                            id="prefs-name"
                            type="text"
                            value={preferencesForm.platformName}
                            onChange={(e) => setPreferencesForm({ ...preferencesForm, platformName: e.target.value })}
                            required
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prefs-fee" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign size={14} className="text-slate-400" /> Frais de livraison par défaut
                          </Label>
                          <div className="relative">
                            <Input
                              id="prefs-fee"
                              type="number"
                              value={preferencesForm.defaultDeliveryFee}
                              onChange={(e) => setPreferencesForm({ ...preferencesForm, defaultDeliveryFee: Number(e.target.value) })}
                              required
                              min={0}
                              className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 pl-4 pr-16 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-wide">
                              CFA
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prefs-support" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Phone size={14} className="text-slate-400" /> Contact Support Client
                          </Label>
                          <Input
                            id="prefs-support"
                            type="text"
                            value={preferencesForm.supportContact}
                            onChange={(e) => setPreferencesForm({ ...preferencesForm, supportContact: e.target.value })}
                            required
                            className="h-12 w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 transition-all outline-none font-bold text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                          {/* Checkbox Preferences */}
                          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center h-5">
                              <input
                                id="prefs-notifications"
                                type="checkbox"
                                checked={preferencesForm.enableEmailNotifications}
                                onChange={(e) => setPreferencesForm({ ...preferencesForm, enableEmailNotifications: e.target.checked })}
                                className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-700 text-brand-primary focus:ring-brand-primary transition-all cursor-pointer"
                              />
                            </div>
                            <div className="text-sm">
                              <label htmlFor="prefs-notifications" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5">
                                <Bell size={14} className="text-slate-400" /> Notifications E-mail
                              </label>
                              <p className="text-slate-550 dark:text-slate-400 text-xs font-medium mt-1 leading-normal">
                                Envoyer des alertes e-mail automatiques aux administrateurs pour les nouvelles commandes.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/10 dark:border-rose-955/20">
                            <div className="flex items-center h-5">
                              <input
                                id="prefs-maintenance"
                                type="checkbox"
                                checked={preferencesForm.maintenanceMode}
                                onChange={(e) => setPreferencesForm({ ...preferencesForm, maintenanceMode: e.target.checked })}
                                className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500 transition-all cursor-pointer"
                              />
                            </div>
                            <div className="text-sm">
                              <label htmlFor="prefs-maintenance" className="font-bold text-rose-600 dark:text-rose-455 cursor-pointer flex items-center gap-1.5">
                                <ShieldAlert size={14} className="text-rose-400" /> Mode Maintenance
                              </label>
                              <p className="text-rose-500/70 dark:text-rose-450 text-xs font-medium mt-1 leading-normal">
                                Restreindre l&apos;accès public à l&apos;application. Seuls les comptes admin pourront y naviguer.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                        <Button 
                          type="submit" 
                          disabled={preferencesSaving}
                          className="h-12 px-6 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {preferencesSaving ? (
                            <>
                              <Loader2 className="animate-spin" size={18} /> Enregistrement...
                            </>
                          ) : (
                            "Enregistrer les préférences"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </Tabs>
    </div>
  );
}
