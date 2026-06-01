"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderSchema, productSchema } from "@/lib/validations/schemas";

export async function createOrderAction(data: any) {
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

export async function createProductAction(data: any) {
  try {
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
