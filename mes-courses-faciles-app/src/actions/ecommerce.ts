"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { orderSchema, productSchema, storeSchema } from "@/lib/validations/schemas";
import { z } from "zod";
import { OrderStatus } from '@prisma/client';
import { resend, FROM_EMAIL, APP_URL } from '@/lib/mail';
import { OrderReceiptEmail } from '@/emails/OrderReceiptEmail';
import { render } from '@react-email/components';
import { requireAuth, requireAdminAuth, AuthError } from '@/lib/auth-guard';
import { resolveImageUrl } from '@/lib/image-resolver';
import { sanitizePrismaArray } from '@/lib/serialization';


export const getCachedActiveStores = unstable_cache(
  async () => {
    const stores = await prisma.store.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { createdAt: "desc" }
    });
    // sanitize : convertit les objets Date en strings ISO avant le passage RSC boundary
    return sanitizePrismaArray(stores);
  },
  ["stores-list"],
  {
    tags: ["stores"]
  }
);

export async function createOrderAction(data: z.infer<typeof orderSchema>) {
  try {
    // Zero-Trust : userId extrait de la session serveur, jamais du payload client
    const session = await requireAuth();

    const validated = orderSchema.parse(data);
    const order = await prisma.order.create({
      data: {
        userId: session.id,           // ← session serveur uniquement
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
  } catch (e: unknown) {
    if (e instanceof AuthError) return { success: false, error: e.message };
    return { success: false, error: (e as Error).message };
  }
}

export async function createStoreAction(data: z.infer<typeof storeSchema>) {
  try {
    const admin = await requireAdminAuth();
    void admin; // session validée

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
    revalidateTag("stores", "max");
    return { success: true, id: store.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateStoreStatusAction(storeId: string, isActive: boolean) {
  try {
    const admin = await requireAdminAuth();
    void admin;

    await prisma.store.update({
      where: { id: storeId },
      data: { isActive },
    });
    revalidatePath("/admin/stores");
    revalidatePath("/");
    revalidateTag("stores", "max");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

interface CartItemInput {
  id: string;
  quantity: number;
  storeId?: string;
}

/**
 * Synchronise le panier guest → DB après authentification.
 * Zero-Trust : le userId est TOUJOURS extrait de la session serveur.
 * Le client ne peut pas passer son propre userId en paramètre.
 */
export async function syncCartAction(cartItems: CartItemInput[]) {
  try {
    const session = await requireAuth();
    const userId = session.id;           // ← source de vérité serveur

    // Écraser l'ancien panier lié à CET utilisateur uniquement
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    if (cartItems.length > 0) {
      const storeId = cartItems[0].storeId;
      if (!storeId) {
        return { success: false, error: "Identifiant du magasin introuvable" };
      }

      const itemsToCreate = cartItems.map(item => ({
        userId,                          // ← session.id, jamais du client
        storeId,
        productId: item.id,
        quantity: item.quantity,
      }));

      await prisma.cartItem.createMany({ data: itemsToCreate });
    }

    return { success: true };
  } catch (e: unknown) {
    if (e instanceof AuthError) return { success: false, error: e.message };
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Récupère le panier DB de l'utilisateur connecté.
 * Zero-Trust : userId extrait de la session, jamais du client.
 */
export async function fetchUserCartAction() {
  try {
    const session = await requireAuth();
    const userId = session.id;           // ← source de vérité serveur

    const items = await prisma.cartItem.findMany({
      where: { userId },                 // ← isolé par session.id
      include: { product: true },
    });

    const formattedCart = items.map(item => ({
      id:       item.productId,
      name:     item.product.name,
      price:    item.product.price,
      // resolveImageUrl gère tous les cas : null, '[]', JSON stringifié, chemin local
      image:    resolveImageUrl(item.product.images, 'product'),
      quantity: item.quantity,
      unit:     item.product.unit || '',
      category: item.product.category,
      storeId:  item.storeId,
    }));

    return { success: true, cart: formattedCart };
  } catch (e: unknown) {
    if (e instanceof AuthError) return { success: false, error: e.message };
    return { success: false, error: (e as Error).message };
  }
}

export async function createProductAction(data: z.infer<typeof productSchema>) {
  try {
    await requireAdminAuth();

    const validated = productSchema.parse(data);
    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: validated.price,
        category: validated.category,
        unit: validated.unit,
        stock: validated.stock,
        images: JSON.stringify(validated.images),
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

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  try {
    await requireAdminAuth();

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateStoreAction(storeId: string, data: z.infer<typeof storeSchema>) {
  try {
    await requireAdminAuth();

    const validated = storeSchema.parse(data);
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name: validated.name,
        address: validated.address,
        district: validated.district,
        phone: validated.phone,
        description: validated.description || null,
        logo: validated.logo || null,
      },
    });

    revalidatePath("/admin/stores");
    revalidatePath("/");
    revalidateTag("stores", "max");
    return { success: true, id: updatedStore.id };
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return { success: false, error: e.issues[0].message };
    }
    return { success: false, error: e.message };
  }
}

export async function deleteStoreAction(storeId: string) {
  try {
    await requireAdminAuth();

    // Soft delete store and its products atomically inside a transaction
    await prisma.$transaction([
      prisma.store.update({
        where: { id: storeId },
        data: { 
          isDeleted: true,
          isActive: false 
        },
      }),
      prisma.product.updateMany({
        where: { storeId },
        data: { 
          isDeleted: true,
          isActive: false 
        },
      })
    ]);

    revalidatePath("/admin/stores");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidateTag("stores", "max");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProductAction(productId: string, data: z.infer<typeof productSchema>) {
  try {
    await requireAdminAuth();

    const validated = productSchema.parse(data);
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: validated.name,
        description: validated.description || null,
        price: validated.price,
        category: validated.category,
        unit: validated.unit,
        stock: validated.stock,
        images: JSON.stringify(validated.images),
        storeId: validated.storeId,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/store/${validated.storeId}`);
    revalidatePath(`/product/${productId}`);
    return { success: true, id: updatedProduct.id };
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return { success: false, error: e.issues[0].message };
    }
    return { success: false, error: e.message };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await requireAdminAuth();

    const product = await prisma.product.update({
      where: { id: productId },
      data: { 
        isDeleted: true,
        isActive: false 
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/store/${product.storeId}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function processCheckoutAction(
  deliveryData: { name: string; phone: string; district: string; indications?: string },
  paymentMethod: 'airtel' | 'moov' | 'card' | 'cash',
  cartItems: { id: string; quantity: number }[]
) {
  try {
    // Zero-Trust : userId extrait de la session JWT côté serveur — jamais du client
    const session = await requireAuth();
    const userId = session.id;

    if (cartItems.length === 0) {
      return { success: false, error: "Le panier est vide." };
    }

    // Zero Trust: load products from database to get actual prices and store ID
    const productIds = cartItems.map(item => item.id);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isDeleted: false,
        isActive: true,
      },
    });

    if (dbProducts.length === 0) {
      return { success: false, error: "Aucun produit valide trouvé dans le panier." };
    }

    // Map database prices for calculation
    const productMap = new Map(dbProducts.map(p => [p.id, p]));
    
    let itemsTotal = 0;
    const itemsData: { productId: string; quantity: number; price: number }[] = [];
    const storeId = dbProducts[0].storeId;

    for (const item of cartItems) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) {
        return { success: false, error: `Le produit avec l'ID ${item.id} n'existe pas ou est indisponible.` };
      }
      
      itemsTotal += dbProduct.price * item.quantity;
      itemsData.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        price: dbProduct.price, // Use DB price (Zero Trust)
      });
    }

    const deliveryFee = 2000;
    const finalTotal = itemsTotal + deliveryFee;
    const deliveryAddress = `${deliveryData.name} - ${deliveryData.phone} - ${deliveryData.district}${
      deliveryData.indications ? ` (${deliveryData.indications})` : ""
    }`;

    // Mock payment gateway latency (Garde-fou 3)
    if (paymentMethod !== 'cash') {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Create the order in DB, bound to the authenticated user ID (Anti-BOLA)
    const order = await prisma.order.create({
      data: {
        userId: userId,          // ← session.id (Zero-Trust, jamais du client)
        storeId: storeId,
        total: finalTotal,
        deliveryFee: deliveryFee,
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryAddress,
        status: "PENDING",
        orderItems: {
          create: itemsData,
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath("/admin");

    const orderCode = `MCF-${order.id.slice(-6).toUpperCase()}`;

    // ── Envoi du reçu email (fire-and-forget, non-bloquant) ─────────────────
    // On ne met pas await pour ne pas bloquer le retour vers le client.
    // Si Resend échoue, le client voit quand même sa page de succès.
    const sendReceiptEmail = async () => {
      try {
        // Récupère l'email du client depuis la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },   // ← session.id
          select: { email: true, name: true },
        });
        if (!dbUser?.email) return;

        // Récupère les noms des produits pour le template
        const orderItemsWithNames = itemsData.map((item) => {
          const product = productMap.get(item.productId);
          return {
            name:      product?.name ?? 'Article',
            quantity:  item.quantity,
            unitPrice: item.price,
          };
        });

        // Récupère le nom du magasin
        const store = await prisma.store.findUnique({
          where: { id: storeId },
          select: { name: true },
        });

        const emailHtml = await render(
          OrderReceiptEmail({
            customerName:    dbUser.name ?? 'Client',
            customerEmail:   dbUser.email,
            orderCode,
            storeName:       store?.name ?? 'Magasin Partenaire',
            items:           orderItemsWithNames,
            subtotal:        itemsTotal,
            deliveryFee,
            total:           finalTotal,
            deliveryAddress,
            paymentMethod,
            appUrl:          APP_URL,
          })
        );

        await resend.emails.send({
          from:    FROM_EMAIL,
          to:      dbUser.email,
          subject: `✅ Commande ${orderCode} confirmée — MesAchats241`,
          html:    emailHtml,
        });

        console.log(`[mail] Reçu envoyé à ${dbUser.email} pour ${orderCode}`);
      } catch (emailError) {
        // L'échec de l'email ne doit JAMAIS bloquer la commande
        console.error('[mail] Erreur envoi reçu (silencieuse):', emailError);
      }
    };

    // Déclenche sans await — la commande est déjà créée en DB
    sendReceiptEmail();

    if (paymentMethod === 'cash') {
      return { success: true, orderId: order.id, orderCode };
    } else {
      // Simulation: Return redirection URL to success page
      const redirectUrl = `/checkout/success?orderId=${orderCode}`;
      return {
        success: true,
        orderId: order.id,
        orderCode,
        redirectUrl
      };
    }
  } catch (e: any) {
    console.error("processCheckoutAction error", e);
    return { success: false, error: e.message || "Une erreur est survenue lors de la validation." };
  }
}



