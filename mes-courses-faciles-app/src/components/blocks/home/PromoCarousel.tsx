"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PromoCarouselProps {
  userName: string;
}

const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    title: 'Fraîcheur Absolue',
    subtitle: 'Des fruits et légumes de qualité supérieure.',
  },
  {
    url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop',
    title: 'Supermarchés Partenaires',
    subtitle: 'Faites vos courses dans les meilleures enseignes de Libreville.',
  },
  {
    url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
    title: 'Livraison Express',
    subtitle: 'Vos achats livrés chez vous en moins de 45 minutes.',
  },
  {
    url: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop',
    title: 'Paiement Sécurisé',
    subtitle: 'Réglez simplement via Airtel Money, Moov Money ou Cash.',
  }
];

export function PromoCarousel({ userName }: PromoCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 min-h-[380px] sm:min-h-[420px] flex items-center p-8 sm:p-12 text-white border border-white/10 shadow-2xl">
      {/* Background Image Carousel with cross-fade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[index].url}
              alt={IMAGES[index].title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-w-7xl) 100vw, 1200px"
              className="brightness-75 contrast-105"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dynamic mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl space-y-6 sm:space-y-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-safran bg-brand-safran/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse" /> Espace Client Privilégié
        </span>
        
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            Ravi de vous revoir, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-safran via-amber-200 to-amber-400 text-glow-safran">
              {userName || 'Client'} ! 👋
            </span>
          </h1>
          
          <div className="h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-slate-300 text-base sm:text-lg font-medium max-w-xl"
              >
                {IMAGES[index].title} — {IMAGES[index].subtitle}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Small premium features badges */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <Clock size={14} className="text-brand-safran" /> 45 min chrono
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <ShieldCheck size={14} className="text-emerald-400" /> Fraîcheur Garantie
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <Flame size={14} className="text-amber-500" /> Airtel & Moov Money
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-4">
          <Link href="/search">
            <Button size="lg" className="bg-brand-safran hover:bg-brand-safran-hover text-white font-bold h-14 px-8 rounded-2xl shadow-safran-btn border-none flex items-center justify-center gap-2 group w-full sm:w-auto">
              Commencer mes courses
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-8 z-10 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-350 outline-none cursor-pointer ${
              i === index ? 'w-8 bg-brand-safran' : 'w-2.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
