import React from 'react';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StoreDetailContent } from '@/components/blocks/stores/StoreDetailContent';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
    select: { name: true, description: true, isActive: true, isDeleted: true }
  });
  return {
    title: store && store.isActive && !store.isDeleted ? `${store.name} | Mes Courses Faciles` : 'Magasin | Mes Courses Faciles',
    description: store?.description || 'Découvrez nos magasins partenaires sur Mes Courses Faciles.',
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  // Get Store from DB
  const store = await prisma.store.findUnique({
    where: { id: resolvedParams.id },
    select: {
      id: true,
      name: true,
      address: true,
      district: true,
      phone: true,
      logo: true,
      description: true,
      isActive: true,
      isDeleted: true,
    }
  });

  if (!store || !store.isActive || store.isDeleted) {
    notFound();
  }

  return <StoreDetailContent store={store} />;
}
