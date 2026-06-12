"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl');
    const query = callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : '';
    router.replace(`/?auth=login${query}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
      <p className="text-muted-foreground text-sm">Redirection vers la connexion...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
      </div>
    }>
      <LoginRedirect />
    </Suspense>
  );
}
