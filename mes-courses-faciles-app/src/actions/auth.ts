"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { loginSchema, userSchema } from "@/lib/validations/schemas";

export async function loginAction(data: any) {
  try {
    const validated = loginSchema.parse(data);
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) return { success: false, error: "Identifiants invalides" };

    const match = await bcrypt.compare(validated.password, user.password);
    if (!match) return { success: false, error: "Identifiants invalides" };

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (e: any) {
    if (e.message?.includes("Can't reach database")) {
        return { success: false, error: "Base de données inaccessible" };
    }
    return { success: false, error: e.message };
  }
}

export async function registerAction(data: any) {
  try {
    const validated = userSchema.parse(data);
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) return { success: false, error: "Cet email est déjà utilisé" };

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        phone: validated.phone,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
