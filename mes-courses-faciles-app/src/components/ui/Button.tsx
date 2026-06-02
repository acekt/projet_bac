"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    primary: "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover",
    secondary: "bg-brand-secondary text-white hover:opacity-90",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-brand-primary hover:text-brand-primary",
    ghost: "text-slate-600 hover:bg-slate-100"
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || (props.disabled as boolean)}
      {...(props as any)}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : null}
      {children as React.ReactNode}
    </motion.button>
  );
};
