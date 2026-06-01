"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
}

export const Card = ({ children, className = '', isHoverable = true }: CardProps) => {
  return (
    <div className={`
      bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
      ${isHoverable ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
