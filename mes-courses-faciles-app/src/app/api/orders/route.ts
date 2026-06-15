import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { orderSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mcf_jwt_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    if (decoded.id !== validatedData.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const order = await prisma.order.create({
      data: {
        userId: validatedData.userId,
        storeId: validatedData.storeId,
        total: validatedData.total,
        deliveryFee: validatedData.deliveryFee,
        paymentMethod: validatedData.paymentMethod,
        deliveryAddress: validatedData.deliveryAddress,
        orderItems: {
          create: validatedData.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    if (error instanceof ZodError) {
       return NextResponse.json({ error: 'Validation échouée', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'UserId requis' }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mcf_jwt_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyJWT(token);
    if (!decoded || (decoded.id !== userId && decoded.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: true, store: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
