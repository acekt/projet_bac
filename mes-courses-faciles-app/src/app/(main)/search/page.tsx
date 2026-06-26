import React, { Suspense } from 'react';
import { DiscoveryBoard, DiscoverySkeleton } from '@/components/blocks/search/DiscoveryBoard';
import { SearchContent } from '@/components/blocks/search/SearchContent';
import { SearchPageSkeleton } from '@/components/common/Skeletons';

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
  // Le DiscoveryBoard is a RSC rendered here (côté serveur) and passed as
  // a React slot to the Client Component. This allows SearchContent to
  // display it in its empty-state without any client-side fetch.
  const discoverySlot = (
    <Suspense fallback={<DiscoverySkeleton />}>
      <DiscoveryBoard />
    </Suspense>
  );

  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent discoverySlot={discoverySlot} />
    </Suspense>
  );
}
