import React from 'react';
import { getOrderStatusConfig } from '@/lib/constants/order-statuses';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = getOrderStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md transition-colors ${config.color} ${className}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
}
