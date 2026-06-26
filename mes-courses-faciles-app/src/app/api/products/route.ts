import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const sort = searchParams.get('sort');

  try {
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' };
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        ...(storeId && { storeId }),
        ...(category && { category }),
        ...(query && {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
          ]
        })
      },
      include: {
        store: {
          select: {
            name: true,
          }
        }
      },
      orderBy
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Une erreur serveur interne est survenue.' }, { status: 500 });
  }
}
