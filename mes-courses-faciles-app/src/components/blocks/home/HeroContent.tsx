"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroContent() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className="space-y-10 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white font-semibold text-sm shadow-sm mx-auto">
        <span className="flex h-2 w-2 rounded-full bg-brand-safran animate-ping" />
        Livraison ultra-rapide à Libreville
      </motion.div>

      {/* Title */}
      <motion.h1 
        variants={itemVariants} 
        className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[1.05] select-none"
      >
        Vos courses faciles <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-safran via-amber-200 to-amber-400 text-glow-safran">
          à Libreville.
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p 
        variants={itemVariants} 
        className="text-lg sm:text-2xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium"
      >
        Le meilleur des magasins locaux livré chez vous en toute sécurité. Payez par <strong className="text-white">Airtel Money</strong>, <strong className="text-white">Moov</strong> ou à la livraison.
      </motion.p>

      {/* Actions */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8"
      >
        <Link href="/search" className="w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
          >
            <Button size="lg" className="h-16 px-10 text-lg bg-brand-safran hover:bg-brand-safran-hover text-white shadow-safran-btn rounded-2xl w-full font-bold">
              Commencer mes achats
            </Button>
          </motion.div>
        </Link>
        <Link href="#magasins" className="w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
          >
            <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl w-full bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 hover:text-white font-semibold">
              Découvrir les magasins
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
