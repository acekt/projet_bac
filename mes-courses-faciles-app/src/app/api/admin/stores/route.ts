import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mcf_jwt_session')?.value;

    if (!token) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stores = await prisma.store.findMany({
      where: { isDeleted: false },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Fetch stores error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
