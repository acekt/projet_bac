import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { DiscoveryBoard, DiscoverySkeleton } from '@/components/blocks/search/DiscoveryBoard';
import { SearchContent } from '@/components/blocks/search/SearchContent';

/**
 * SearchPage — Server Component (RSC)
 *
 * Architecture mixte RSC + Client :
 * - SearchContent : Client Component (gère l'input, la recherche API, et l'état)
 * - DiscoveryBoard : Server Component passé via prop `discoverySlot`
 *   → Prisma est exécuté côté serveur, le résultat est rendu en HTML avant streaming
 *   → Zéro JS supplémentaire pour charger les données de découverte
 */
export default function SearchPage() {
  // Le DiscoveryBoard est un RSC rendu ici (côté serveur) et passé comme
  // un slot React au Client Component. Cela permet à SearchContent de
  // l'afficher dans son empty-state sans le moindre appel fetch côté client.
  const discoverySlot = (
    <Suspense fallback={<DiscoverySkeleton />}>
      <DiscoveryBoard />
    </Suspense>
  );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-mesh bg-noise py-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      }
    >
      <SearchContent discoverySlot={discoverySlot} />
    </Suspense>
  );
}
