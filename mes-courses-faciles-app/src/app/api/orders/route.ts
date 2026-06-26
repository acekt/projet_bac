import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { orderSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

/**
 * Helper local — extrait la session depuis le cookie JWT.
 * Zero-Trust : le userId n'est JAMAIS lu depuis les query params ou le body.
 */
async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mcf_jwt_session')?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  if (!decoded || typeof decoded.id !== 'string') return null;
  return decoded;
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Usage : création d'une commande (legacy — préférer processCheckoutAction)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        userId:          session.id as string,           // JWT payload — validé dans getSession()
        storeId:         validatedData.storeId,
        total:           validatedData.total,
        deliveryFee:     validatedData.deliveryFee,
        paymentMethod:   validatedData.paymentMethod,
        deliveryAddress: validatedData.deliveryAddress,
        orderItems: {
          create: validatedData.items.map((item) => ({
            productId: item.id,
            quantity:  item.quantity,
            price:     item.price,
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation échouée', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Une erreur serveur interne est survenue.' }, { status: 500 });
  }
}

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Zero-Trust : le userId est EXTRAIT de la session JWT — jamais du query param.
// Avant : GET /api/orders?userId=abc  (exposition du userId dans l'URL)
// Après : GET /api/orders             (userId lu depuis le cookie httpOnly)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // IDOR fix : isolation stricte par session.id
    // Un utilisateur ne peut lire QUE SES propres commandes via cette route.
    // Les admins passent par /api/admin/* qui a sa propre couche d'autorisation.
    const orders = await prisma.order.findMany({
      where: { userId: session.id as string },  // JWT payload — validé dans getSession()
      include: { orderItems: true, store: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Une erreur serveur interne est survenue.' }, { status: 500 });
  }
}
