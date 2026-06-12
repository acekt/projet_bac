"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('./AuthModal').then(mod => mod.AuthModal), {
  ssr: false,
});

export function AuthModalWrapper() {
  return (
    <Suspense fallback={null}>
      <AuthModal />
    </Suspense>
  );
}
