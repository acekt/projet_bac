"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import fs from "fs";
import path from "path";

const PREFERENCES_FILE_PATH = path.join(process.cwd(), "src/data/preferences.json");

// Helper to verify the admin session
async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mcf_jwt_session")?.value;
  if (!token) return null;
  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== "ADMIN") return null;
  return decoded;
}

// Zod schemas for validation
const updateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/, "Format de téléphone invalide").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir une majuscule")
    .regex(/[0-9]/, "Doit contenir un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

const platformPreferencesSchema = z.object({
  platformName: z.string().min(2, "Le nom de la plateforme est requis"),
  defaultDeliveryFee: z.coerce.number().nonnegative("Les frais de livraison ne peuvent pas être négatifs"),
  maintenanceMode: z.boolean(),
  enableEmailNotifications: z.boolean(),
  supportContact: z.string().min(5, "Contact de support invalide"),
});

// Fetch current admin details from database
export async function getAdminProfileAction() {
  try {
    const adminSession = await getAdminUser();
    if (!adminSession) return { success: false, error: "Non autorisé" };

    const admin = await prisma.user.findUnique({
      where: { id: adminSession.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) return { success: false, error: "Administrateur non trouvé" };
    return { success: true, admin };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Update admin details in database
export async function updateAdminProfileAction(data: z.infer<typeof updateProfileSchema>) {
  try {
    const adminSession = await getAdminUser();
    if (!adminSession) return { success: false, error: "Non autorisé" };

    const validated = updateProfileSchema.parse(data);

    // Check if email is already taken by another user
    const existing = await prisma.user.findFirst({
      where: {
        email: validated.email,
        NOT: { id: adminSession.id as string },
      },
    });

    if (existing) {
      return { success: false, error: "Cet email est déjà associé à un autre compte" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: adminSession.id as string },
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        address: validated.address || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    revalidatePath("/admin/settings");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

// Update admin password
export async function updateAdminPasswordAction(data: z.infer<typeof updatePasswordSchema>) {
  try {
    const adminSession = await getAdminUser();
    if (!adminSession) return { success: false, error: "Non autorisé" };

    const validated = updatePasswordSchema.parse(data);

    // Fetch user including password
    const user = await prisma.user.findUnique({
      where: { id: adminSession.id as string },
    });

    if (!user) return { success: false, error: "Utilisateur introuvable" };

    // Verify current password
    const match = await bcrypt.compare(validated.currentPassword, user.password);
    if (!match) return { success: false, error: "Mot de passe actuel incorrect" };

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

    // Update in database
    await prisma.user.update({
      where: { id: adminSession.id as string },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

const readPreferencesFileCached = unstable_cache(
  async () => {
    const defaultPrefs = {
      platformName: "MesCoursesFaciles",
      defaultDeliveryFee: 1000,
      maintenanceMode: false,
      enableEmailNotifications: true,
      supportContact: "+241 07 00 00 00",
    };

    if (!fs.existsSync(PREFERENCES_FILE_PATH)) {
      const dir = path.dirname(PREFERENCES_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(PREFERENCES_FILE_PATH, JSON.stringify(defaultPrefs, null, 2));
      return defaultPrefs;
    }

    const rawData = fs.readFileSync(PREFERENCES_FILE_PATH, "utf-8");
    return JSON.parse(rawData);
  },
  ["platform-preferences"],
  {
    tags: ["preferences"]
  }
);

// Fetch platform preferences (stored in JSON)
export async function getPlatformPreferencesAction() {
  try {
    const adminSession = await getAdminUser();
    if (!adminSession) return { success: false, error: "Non autorisé" };

    const preferences = await readPreferencesFileCached();
    return { success: true, preferences };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Update platform preferences (stored in JSON)
export async function updatePlatformPreferencesAction(data: z.infer<typeof platformPreferencesSchema>) {
  try {
    const adminSession = await getAdminUser();
    if (!adminSession) return { success: false, error: "Non autorisé" };

    const validated = platformPreferencesSchema.parse(data);

    // Ensure directory exists
    const dir = path.dirname(PREFERENCES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(PREFERENCES_FILE_PATH, JSON.stringify(validated, null, 2));

    revalidateTag("preferences");
    revalidatePath("/admin/settings");
    return { success: true, preferences: validated };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

// Schema for manual user creation by admin
const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["CLIENT", "ADMIN"]),
});

// Action to create user manually
export async function createUserAction(data: z.infer<typeof createUserSchema>) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Non autorisé" };

    const validated = createUserSchema.parse(data);

    // Check if email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return { success: false, error: "Cet email est déjà associé à un autre compte" };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
        isActive: true,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

// Action to enable/suspend user account access
export async function updateUserStatusAction(userId: string, isActive: boolean) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Non autorisé" };

    // Prevent admin from suspending their own account
    if (userId === admin.id) {
      return { success: false, error: "Vous ne pouvez pas suspendre votre propre compte" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationAsReadAction(id: string) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Non autorisé" };

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Non autorisé" };

    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNotificationAction(id: string) {
  try {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: "Non autorisé" };

    await prisma.notification.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
