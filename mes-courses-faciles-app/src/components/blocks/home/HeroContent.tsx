"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShoppingBag, CreditCard, ArrowRight, Clock, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export function HeroContent() {
  // ── Animation Variants ──────────────────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14
      }
    }
  };

  // ── 3D Hover Parallax Effect ──────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // rotation limits: -10deg to 10deg
  const rotateX = useTransform(mouseY, [-250, 250], [10, -10]);
  const rotateY = useTransform(mouseX, [-250, 250], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = e.clientX - rect.left - width / 2;
    const yVal = e.clientY - rect.top - height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-center lg:text-left max-w-7xl mx-auto w-full">
      {/* ── COLONNE GAUCHE : Textes & Actions ── */}
      <motion.div
        className="lg:col-span-6 space-y-8 flex flex-col items-center lg:items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium Badge */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white/90 font-medium text-xs shadow-glow-small"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-brand-safran animate-pulse" />
          Livraison ultra-rapide en 45 min chrono
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={itemVariants} 
          className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black text-white tracking-tight leading-[1.05] select-none"
        >
          Faites vos courses <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-safran via-amber-300 to-amber-500 text-glow-safran">
            sans effort.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          variants={itemVariants} 
          className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-medium"
        >
          Le premier service de livraison de supermarchés premium à Libreville. Commandez en ligne, réglez en toute simplicité via Mobile Money, et profitez de la fraîcheur livrée chez vous.
        </motion.p>

        {/* Actions CTAs */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
        >
          <Link href="#magasins" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button size="lg" className="h-14 px-8 text-sm bg-brand-safran hover:bg-brand-safran-hover text-white shadow-safran-btn rounded-xl w-full font-bold flex items-center justify-center gap-2">
                Découvrir les magasins <ArrowRight size={16} />
              </Button>
            </motion.div>
          </Link>
          <Link href="/search" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button variant="outline" size="lg" className="h-14 px-8 text-sm rounded-xl w-full bg-white/5 backdrop-blur-md text-white border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white font-semibold">
                Parcourir les produits
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Micro Features / Trust */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-6 border-t border-white/5 w-full text-slate-200 text-xs font-semibold"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Paiement Sécurisé Airtel/Moov</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-safran" />
            <span>Service Client 7j/7</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── COLONNE DROITE : 3D UI Scene (Interactive Parallax) ── */}
      <div 
        className="lg:col-span-6 relative flex justify-center items-center h-[520px] w-full cursor-grab active:cursor-grabbing select-none perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div 
          className="relative w-full max-w-[420px] h-[380px] transition-all duration-300 ease-out"
          style={{ 
            rotateX, 
            rotateY, 
            transformStyle: "preserve-3d" 
          }}
        >
          {/* 1. Carte principale : Store Card en fond (translateZ -30px) */}
          <div 
            className="absolute inset-0 rounded-[2.5rem] bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
            style={{ transform: "translateZ(-30px)" }}
          >
            {/* Décorations de la carte */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-primary/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-brand-safran/10 blur-2xl" />

            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-brand-safran uppercase">Supermarché</span>
                <h3 className="text-xl font-bold text-white leading-tight">Mbolo Libreville</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                Ouvert
              </span>
            </div>

            {/* Simulated Grid list of products inside card */}
            <div className="space-y-3 my-4 z-10">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">🥑</div>
                  <span className="text-xs font-bold text-white">Avocats Bio du Gabon</span>
                </div>
                <span className="text-xs font-black text-brand-safran">2 500 CFA</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">🥛</div>
                  <span className="text-xs font-bold text-white">Lait Entier MCF 1L</span>
                </div>
                <span className="text-xs font-black text-brand-safran">850 CFA</span>
              </div>
            </div>

            <div className="flex justify-between items-center z-10 pt-2 border-t border-white/5 text-[11px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>4.8 (120 avis)</span>
              </div>
              <span>30-45 min</span>
            </div>
          </div>

          {/* 2. Carte avant-plan : Suivi de livraison (translateZ 40px) */}
          <motion.div 
            className="absolute -bottom-6 -right-6 w-[260px] rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-glow p-4 space-y-3"
            style={{ transform: "translateZ(40px)" }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-safran/20 text-brand-safran flex items-center justify-center animate-pulse">
                  <Clock size={12} />
                </div>
                <span className="text-xs font-bold text-white">Livraison active</span>
              </div>
              <span className="text-[10px] font-bold text-brand-safran">En route</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-safran"
                initial={{ width: "10%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium">
              <span>Mbolo $\rightarrow$ Akanda</span>
              <span className="font-bold text-white">Arrivée estimée : 14 min</span>
            </div>
          </motion.div>

          {/* 3. Carte de paiement flottante en lévitation : Airtel Money Premium Gold (translateZ 90px) */}
          <motion.div 
            className="absolute -top-10 -left-10 w-[200px] h-[120px] rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border border-white/20 shadow-2xl p-4 flex flex-col justify-between"
            style={{ transform: "translateZ(90px) rotate(-8deg)" }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="flex justify-between items-start">
              <div className="text-[9px] font-black uppercase tracking-widest text-amber-950">Airtel Money</div>
              <CreditCard size={16} className="text-amber-950/70" />
            </div>
            <div className="text-xs font-mono font-bold text-amber-950/80">•••• •••• •••• 9876</div>
            <div className="flex justify-between items-end">
              <div className="text-[8px] font-bold text-amber-950/70">EMMA</div>
              <span className="h-4 w-4 rounded-full bg-red-600/70 flex items-center justify-center text-[7px] font-bold text-white">MCF</span>
            </div>
          </motion.div>

          {/* 4. Mini Badge flottante : Shopping Bag (translateZ 120px) */}
          <motion.div 
            className="absolute top-1/2 -right-8 w-14 h-14 rounded-full bg-brand-primary border border-white/20 shadow-glow flex items-center justify-center text-white"
            style={{ transform: "translateZ(120px)" }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-brand-safran text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md">
              +3
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
