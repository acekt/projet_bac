import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ stores: [], products: [] });
    }

    // Search stores matching the query
    const stores = await prisma.store.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
      },
      take: 3,
    });

    // Search products matching the query
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        category: true,
        storeId: true,
        store: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    });

    return NextResponse.json({ stores, products });
  } catch (error) {
    console.error('[SUGGESTIONS_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
