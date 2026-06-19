import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/blocks/client/ProfileClient';
import { Order as OrderType, SessionUser } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mcf_jwt_session')?.value;
  if (!token) {
    redirect('/?auth=login&callbackUrl=/profile');
  }

  const decoded = (await verifyJWT(token)) as unknown as SessionUser;
  if (!decoded) {
    redirect('/?auth=login&callbackUrl=/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  if (!user) {
    redirect('/?auth=login&callbackUrl=/profile');
  }

  // Isolation stricte : Un admin requêtant le profil client est redirigé vers l'admin settings
  if (user.role !== 'CLIENT') {
    redirect('/admin/settings');
  }

  // Fetch orders from DB directly
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      orderItems: {
        include: {
          product: true,
        }
      },
      store: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Cast orders to OrderType[] safely
  const formattedOrders: OrderType[] = orders.map(order => ({
    id: order.id,
    userId: order.userId,
    storeId: order.storeId,
    total: order.total,
    deliveryFee: order.deliveryFee,
    status: order.status as OrderType['status'],
    paymentMethod: order.paymentMethod,
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt,
    store: order.store ? {
      id: order.store.id,
      name: order.store.name,
      address: order.store.address,
      district: order.store.district,
      phone: order.store.phone,
      logo: order.store.logo,
      description: order.store.description,
      isActive: order.store.isActive,
    } : undefined,
    orderItems: order.orderItems.map(item => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        category: item.product.category,
        stock: item.product.stock,
        unit: item.product.unit,
        images: item.product.images,
        isActive: item.product.isActive,
        storeId: item.product.storeId,
      } : undefined
    }))
  }));

  // Map user to match the props structure expected
  const clientUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return <ProfileClient initialUser={clientUser} initialOrders={formattedOrders} />;
}
