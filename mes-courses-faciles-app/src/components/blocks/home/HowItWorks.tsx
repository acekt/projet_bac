"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Store, ShoppingCart, Truck, Star, Plus, Minus, CheckCircle, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="comment-ca-marche" className="py-32 relative overflow-hidden bg-background">
      {/* Decorative background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-brand-safran uppercase tracking-widest bg-brand-safran/10 px-4 py-1.5 rounded-full inline-block"
          >
            Simplicité Absolue
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
          >
            Comment ça marche ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 font-medium"
          >
            Faire ses courses en ligne à Libreville n'a jamais été aussi simple, fluide et sécurisé.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Étape 1 : Choisissez un magasin (Bento Large - 2/3 cols sur desktop) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-2 group relative rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden p-8 flex flex-col justify-between min-h-[380px] hover:border-slate-800/80 transition-all duration-300 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              <div className="space-y-4 z-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-safran/15 text-brand-safran flex items-center justify-center">
                    <Store size={22} />
                  </div>
                  <span className="text-3xl font-black text-white/20">01</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Choisissez votre magasin</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Sélectionnez votre supermarché préféré parmi nos partenaires de confiance à Libreville (Mbolo, Géant Casino, etc.) et accédez à tout leur catalogue en direct.
                </p>
              </div>

              {/* Visual Mockup: Simulated Store Selection list */}
              <div className="relative rounded-2xl bg-slate-950/60 border border-white/5 p-4 space-y-3 shadow-2xl transform lg:group-hover:scale-[1.03] transition-transform duration-500">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-brand-safran/20 text-brand-safran flex items-center justify-center font-bold text-sm">MB</div>
                  <div className="flex-grow text-left">
                    <div className="text-xs font-bold text-white">Mbolo Supermarché</div>
                    <div className="text-[10px] text-slate-400">Fruits, Légumes & Alimentation</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Star size={10} className="fill-amber-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 opacity-70">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-sm">GC</div>
                  <div className="flex-grow text-left">
                    <div className="text-xs font-bold text-white">Géant Casino</div>
                    <div className="text-[10px] text-slate-400">Épicerie fine & Surgelés</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Star size={10} className="fill-amber-400" />
                    <span>4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Étape 2 : Remplissez votre panier (Bento Normal - 1/3 col) */}
          <motion.div 
            variants={cardVariants}
            className="group relative rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden p-8 flex flex-col justify-between min-h-[380px] hover:border-slate-800/80 transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4 z-10 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center">
                  <ShoppingCart size={22} />
                </div>
                <span className="text-3xl font-black text-white/20">02</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Remplissez votre panier</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Ajoutez vos articles d'épicerie et produits frais. Notre catalogue intègre les stocks réels et des descriptions soignées.
              </p>
            </div>

            {/* Visual Mockup: Interactive Cart Drawer item */}
            <div className="relative rounded-2xl bg-slate-950/60 border border-white/5 p-4 mt-6 shadow-2xl transform lg:group-hover:-translate-y-1 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">🍫</div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-white">Chocolat Noir 70%</div>
                    <div className="text-[9px] text-slate-400">1 200 CFA</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
                  <button className="h-5 w-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"><Minus size={10} /></button>
                  <span className="text-xs font-bold text-white">2</span>
                  <button className="h-5 w-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"><Plus size={10} /></button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Étape 3 : Livraison & Paiement (Bento Full - 3/3 cols) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-3 group relative rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden p-8 flex flex-col justify-between min-h-[340px] hover:border-slate-800/80 transition-all duration-300 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              <div className="lg:col-span-5 space-y-4 z-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Truck size={22} />
                  </div>
                  <span className="text-3xl font-black text-white/20">03</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Livraison & Paiement Sécurisés</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Suivez votre livreur partenaire en temps réel de la boutique à votre adresse de livraison. Choisissez le règlement Mobile Money (Airtel, Moov) ou en espèces à la réception.
                </p>
              </div>

              {/* Visual Mockup: Delivery Progress & Secure Badge */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <div className="rounded-2xl bg-slate-950/60 border border-white/5 p-4 flex flex-col justify-between shadow-2xl">
                  <div className="text-left space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Temps réel</span>
                    <h4 className="text-xs font-bold text-white">ETA : 12 minutes</h4>
                  </div>
                  {/* Visual tracker line */}
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    <div className="h-1 flex-grow bg-emerald-500 rounded-full" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div className="h-1 flex-grow bg-white/10 rounded-full" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10 shrink-0" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/60 border border-white/5 p-4 flex flex-col justify-between shadow-2xl">
                  <div className="text-left space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      <ShieldCheck size={12} />
                      <span>Transactions</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Paiement Mobile Actif</h4>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black tracking-wider uppercase border border-red-500/20">Airtel</span>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black tracking-wider uppercase border border-blue-500/20">Moov</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
