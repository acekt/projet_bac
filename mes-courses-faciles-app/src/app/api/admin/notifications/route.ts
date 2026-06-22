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

    // 1. Fetch pending orders from DB
    const pendingOrders = await prisma.order.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { name: true } } }, // Least-privilege: name only, no password/email
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch out-of-stock products from DB
    const outOfStockProducts = await prisma.product.findMany({
      where: { stock: 0, isDeleted: false },
      orderBy: { updatedAt: 'desc' },
    });

    // 3. Create active alerts list
    const activeAlerts = [
      ...pendingOrders.map(order => ({
        reference: `order-${order.id}`,
        type: 'ORDER',
        message: `Nouvelle commande de ${order.user?.name || 'Client'} (${order.total.toLocaleString()} CFA)`,
        createdAt: order.createdAt
      })),
      ...outOfStockProducts.map(product => ({
        reference: `product-${product.id}`,
        type: 'STOCK',
        message: `Produit en rupture de stock : ${product.name}`,
        createdAt: product.updatedAt
      }))
    ];

    const activeReferences = new Set(activeAlerts.map(a => a.reference));

    // 4. Fetch all existing notifications from DB
    const dbNotifications = await prisma.notification.findMany();
    const dbRefs = new Set(dbNotifications.map(n => n.reference));

    // 5. Create new notifications in DB
    const toCreate = activeAlerts.filter(a => !dbRefs.has(a.reference));
    for (const notif of toCreate) {
      try {
        await prisma.notification.create({
          data: {
            type: notif.type,
            message: notif.message,
            reference: notif.reference,
            isRead: false,
            createdAt: notif.createdAt
          }
        });
      } catch (err) {
        console.error(`Error creating notification for ${notif.reference}:`, err);
      }
    }

    // 6. Auto-resolve notifications that are no longer active
    // If a notification is unread in DB but no longer active, mark it as read.
    const toAutoRead = dbNotifications.filter(n => !n.isRead && !activeReferences.has(n.reference));
    for (const notif of toAutoRead) {
      try {
        await prisma.notification.update({
          where: { id: notif.id },
          data: { isRead: true }
        });
      } catch (err) {
        console.error(`Error auto-reading notification for ${notif.reference}:`, err);
      }
    }

    // 7. Re-fetch all notifications (sorted by createdAt desc)
    const finalNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const hasUnread = finalNotifications.some(n => !n.isRead);

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    return NextResponse.json({
      hasUnread,
      hasBadge: hasUnread, // For backward compatibility
      alerts: getAll ? finalNotifications : finalNotifications.slice(0, 5)
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
