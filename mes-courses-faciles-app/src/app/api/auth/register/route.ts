import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { userSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';
import { signJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side deep validation
    const validatedData = userSchema.parse(body);
    const { name, email, password, phone } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    const { password: _password, ...userWithoutPassword } = user;

    const token = await signJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const cookieStore = await cookies();
    cookieStore.set('mcf_jwt_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.code === 'P2024' || error.message.includes('Can\'t reach database server')) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
