import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
    });
    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: 'Une erreur serveur interne est survenue.' }, { status: 500 });
  }
}
