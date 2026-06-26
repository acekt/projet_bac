import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { StoresListContent } from '@/components/blocks/stores/StoresListContent';
import { Metadata } from 'next';
import { StoresPageSkeleton } from '@/components/common/Skeletons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nos Magasins Partenaires | Mes Courses Faciles',
  description: 'Découvrez tous nos supermarchés et magasins partenaires à Libreville. Commandez en ligne et faites-vous livrer en 45 minutes.',
};

async function StoresLoader() {
  // Query all active and non-deleted stores
  const stores = await prisma.store.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
    include: {
      products: {
        where: {
          isActive: true,
          isDeleted: false,
        },
        select: {
          category: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Extract unique list of districts for filtering
  const districtsSet = new Set<string>();
  stores.forEach(s => {
    if (s.district) {
      districtsSet.add(s.district.trim());
    }
  });
  const districts = Array.from(districtsSet).sort((a, b) => a.localeCompare(b, 'fr'));

  return <StoresListContent initialStores={stores} districts={districts} />;
}

export default function StoresPage() {
  return (
    <Suspense fallback={<StoresPageSkeleton />}>
      <StoresLoader />
    </Suspense>
  );
}
