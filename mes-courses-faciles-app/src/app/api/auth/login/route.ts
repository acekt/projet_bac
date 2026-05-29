import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation échouée', details: error.flatten().fieldErrors }, { status: 400 });
    }

    if (error.code === 'P2024' || error.message.includes('Can\'t reach database server')) {
      return NextResponse.json({ error: 'La base de données est inaccessible. Veuillez vérifier que MySQL est lancé dans XAMPP.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
