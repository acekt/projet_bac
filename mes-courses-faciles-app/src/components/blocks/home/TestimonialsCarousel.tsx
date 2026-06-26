"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Sylvie Assoumou",
    address: "Akanda, Libreville",
    stars: 5,
    avatar: "SA",
    text: "Un service exceptionnel ! Je fais mes courses chez Mbolo depuis mon canapé à Akanda et je suis livrée en moins d'une heure. Les produits frais sont parfaitement choisis.",
    bgGradient: "from-brand-safran/10 via-amber-500/5 to-transparent",
    accentColor: "text-brand-safran"
  },
  {
    name: "Marc Obame",
    address: "Louis, Libreville",
    stars: 5,
    avatar: "MO",
    text: "J'utilise Airtel Money pour payer et tout se passe de manière hyper fluide. C'est sécurisé, transparent et le livreur m'appelle dès qu'il est en route. Top !",
    bgGradient: "from-brand-primary/10 via-emerald-500/5 to-transparent",
    accentColor: "text-brand-primary"
  },
  {
    name: "Karen Ndong",
    address: "Sablière, Libreville",
    stars: 5,
    avatar: "KN",
    text: "MesCoursesFaciles m'a fait gagner des heures chaque semaine. Plus besoin de subir les embouteillages pour aller au supermarché. Je recommande à 100%.",
    bgGradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    accentColor: "text-indigo-400"
  }
];

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const current = TESTIMONIALS[index];

  return (
    <section id="avis" className="py-32 relative overflow-hidden bg-background">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-brand-safran/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-safran uppercase tracking-widest bg-brand-safran/10 px-4 py-1.5 rounded-full inline-block">
            Avis Vérifiés
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ce que disent nos clients</h2>
          <p className="text-base text-slate-500 font-medium">Découvrez les retours d'expérience authentiques de nos clients à Libreville.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[340px] flex items-center justify-center">
          {/* Navigation buttons */}
          <div className="absolute left-0 lg:-left-16 z-20">
            <button
              onClick={handlePrev}
              className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
              aria-label="Avis précédent"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute right-0 lg:-right-16 z-20">
            <button
              onClick={handleNext}
              className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
              aria-label="Avis suivant"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Testimonial Card */}
          <div className="w-full max-w-2xl overflow-hidden px-4 md:px-0">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full rounded-[2.5rem] p-8 md:p-12 border border-slate-800 bg-slate-900 shadow-2xl relative text-left"
              >
                <Quote className="absolute top-8 right-8 text-white/5 h-20 w-20 pointer-events-none" />

                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(current.stars)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-lg md:text-xl text-slate-100 italic leading-relaxed font-medium">
                    "{current.text}"
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-800 mt-6">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm ${current.accentColor}`}>
                      {current.avatar}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm md:text-base">{current.name}</h5>
                      <p className="text-xs text-slate-400">{current.address}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators / Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-brand-safran" : "w-2 bg-slate-200 hover:bg-slate-350"
              }`}
              aria-label={`Aller à l'avis ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
