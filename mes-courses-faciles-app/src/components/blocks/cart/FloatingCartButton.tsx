"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartDrawer } from './CartDrawer';

export function FloatingCartButton() {
  const pathname = usePathname();

  // Hide the floating cart button on checkout pages to avoid overlapping UI fields
  if (pathname?.startsWith('/checkout')) {
    return null;
  }

  return <CartDrawer isFloating />;
}
