"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderSchema, productSchema, storeSchema } from "@/lib/validations/schemas";
import { z } from "zod";
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mcf_jwt_session')?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'ADMIN') return null;
  return decoded;
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mcf_jwt_session')?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  if (!decoded) return null;
  return decoded;
}

export async function createOrderAction(data: z.infer<typeof orderSchema>) {
  try {
    const validated = orderSchema.parse(data);
    const order = await prisma.order.create({
      data: {
        userId: validated.userId,
        storeId: validated.storeId,
        total: validated.total,
        deliveryFee: validated.deliveryFee,
        paymentMethod: validated.paymentMethod,
        deliveryAddress: validated.deliveryAddress,
        orderItems: {
          create: validated.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true, id: order.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createStoreAction(data: z.infer<typeof storeSchema>) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    const validated = storeSchema.parse(data);
    const store = await prisma.store.create({
      data: {
        name: validated.name,
        address: validated.address,
        district: validated.district,
        phone: validated.phone,
        description: validated.description,
        logo: validated.logo || null,
        isActive: true,
      },
    });
    revalidatePath("/admin/stores");
    revalidatePath("/");
    return { success: true, id: store.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateStoreStatusAction(storeId: string, isActive: boolean) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    await prisma.store.update({
      where: { id: storeId },
      data: { isActive },
    });
    revalidatePath("/admin/stores");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function syncCartAction(userId: string, cartItems: any[]) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.id !== userId) return { success: false, error: "Unauthorized" };

    // Supprimer l'ancien panier
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    // S'il y a des articles, on vérifie qu'ils sont tous du même magasin (règle métier)
    if (cartItems.length > 0) {
       const storeId = cartItems[0].storeId;

       const itemsToCreate = cartItems.map(item => ({
           userId,
           storeId,
           productId: item.id,
           quantity: item.quantity
       }));

       await prisma.cartItem.createMany({
           data: itemsToCreate
       });
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function fetchUserCartAction(userId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.id !== userId) return { success: false, error: "Unauthorized" };

      const items = await prisma.cartItem.findMany({
          where: { userId },
          include: {
              product: true
          }
      });

      const formattedCart = items.map(item => ({
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images ? JSON.parse(item.product.images)[0] : '',
          quantity: item.quantity,
          unit: item.product.unit || '',
          category: item.product.category,
          storeId: item.storeId
      }));

      return { success: true, cart: formattedCart };
  } catch (e: any) {
      return { success: false, error: e.message };
  }
}

export async function createProductAction(data: z.infer<typeof productSchema>) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Unauthorized" };

    const validated = productSchema.parse(data);
    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: validated.price,
        category: validated.category,
        unit: validated.unit,
        stock: validated.stock,
        images: JSON.stringify([validated.image]),
        storeId: validated.storeId,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath(`/store/${validated.storeId}`);
    return { success: true, id: product.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
