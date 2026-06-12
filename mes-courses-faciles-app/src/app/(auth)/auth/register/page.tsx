"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?auth=register');
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
      <p className="text-muted-foreground text-sm">Redirection vers l&apos;inscription...</p>
    </div>
  );
}
