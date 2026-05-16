import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const category = searchParams.get('category');

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(storeId && { storeId }),
        ...(category && { category }),
      },
      include: {
        store: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
