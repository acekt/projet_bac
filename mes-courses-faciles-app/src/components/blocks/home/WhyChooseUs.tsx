"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Flame, Star, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentClass: string;
}

function FeatureCard({ icon, title, description, accentClass }: FeatureCardProps) {
  // ── Glare Effect handler ──
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-[2rem] p-8 border border-slate-200/80 bg-slate-50 overflow-hidden transition-all duration-500 hover:border-slate-350 hover:shadow-lg transform-gpu hover:-translate-y-1"
      style={{
        background: "radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 0, 0, 0.02), transparent 80%)"
      } as React.CSSProperties}
    >
      {/* Accent color dot in top-right */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity ${accentClass}`} />

      <div className="space-y-4 relative z-10 text-left">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform duration-300 shadow-sm">
          {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors duration-300">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  const textVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const cardAnim: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  return (
    <section id="avantages" className="py-32 relative overflow-hidden bg-background">
      {/* Background ambient lighting */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Col Gauche : Description Textuelle */}
          <motion.div 
            className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-4 py-1.5 rounded-full inline-block">
              Pourquoi nous choisir ?
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              L'excellence dans <br className="hidden lg:block" />
              chaque livraison.
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium text-base">
              Nous avons conçu l'application pour répondre aux exigences les plus strictes de nos clients à Libreville en termes de qualité, de rapidité et de sécurité.
            </p>
          </motion.div>

          {/* Col Droite : Grille des Avantages */}
          <motion.div 
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={cardAnim}>
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-emerald-600" />}
                title="Sécurité Absolue"
                description="Paiements mobiles cryptés via Airtel Money et Moov Money, ou règlement en espèces direct auprès du livreur à la réception."
                accentClass="bg-emerald-500"
              />
            </motion.div>

            <motion.div variants={cardAnim}>
              <FeatureCard
                icon={<Flame className="h-6 w-6 text-brand-safran" />}
                title="45 min Chrono"
                description="Notre réseau optimisé de livreurs partenaires sillonne Libreville pour livrer vos courses dans le respect de la chaîne du froid."
                accentClass="bg-brand-safran"
              />
            </motion.div>

            <motion.div variants={cardAnim}>
              <FeatureCard
                icon={<Star className="h-6 w-6 text-amber-555 text-amber-500" />}
                title="Fraîcheur Garantie"
                description="Nos acheteurs formés sélectionnent méticuleusement vos fruits, légumes et produits frais comme si c'était pour eux."
                accentClass="bg-amber-400"
              />
            </motion.div>

            <motion.div variants={cardAnim}>
              <FeatureCard
                icon={<Users className="h-6 w-6 text-indigo-650 text-indigo-650 text-indigo-600" />}
                title="Service Client Dédié"
                description="Une équipe support basée à Libreville, disponible 7j/7 pour répondre à toutes vos demandes de commande ou livraison."
                accentClass="bg-indigo-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
