"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "Retour", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    } else {
      // Avoid crash or empty history issues
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`group inline-flex items-center gap-2.5 font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white active:scale-95 transition-all rounded-full py-2.5 px-4 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm hover:bg-white/70 dark:hover:bg-slate-800/60 hover:shadow-md cursor-pointer ${className}`}
    >
      <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
      {label && <span className="text-sm tracking-tight">{label}</span>}
    </Button>
  );
}
