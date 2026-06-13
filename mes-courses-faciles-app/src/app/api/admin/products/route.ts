import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { productSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mcf_jwt_session')?.value;

  if (!token) {
    return { authorized: false, status: 401, error: 'Unauthorized' };
  }

  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'ADMIN') {
    return { authorized: false, status: 403, error: 'Forbidden' };
  }

  return { authorized: true };
}

export async function POST(request: Request) {
  try {
    const access = await checkAdminAccess();
    if (!access.authorized) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        unit: validatedData.unit,
        stock: validatedData.stock,
        images: JSON.stringify(validatedData.images),
        storeId: validatedData.storeId,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Admin product creation error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const access = await checkAdminAccess();
    if (!access.authorized) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: { store: true }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

