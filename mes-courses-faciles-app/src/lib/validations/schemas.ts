import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir une majuscule")
    .regex(/[0-9]/, "Doit contenir un chiffre"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/, "Format de téléphone invalide"),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const storeSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse est requise"),
  district: z.string().min(2, "Le quartier est requis"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/, "Format de téléphone invalide"),
  description: z.string().optional(),
  logo: z.string().url("URL d'image invalide").optional().or(z.literal('')),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  stock: z.coerce.number().int().nonnegative("Le stock ne peut pas être négatif"),
  category: z.string().min(1, "Catégorie requise"),
  unit: z.string().min(1, "Unité requise"),
  storeId: z.string().min(1, "Magasin requis"),
  description: z.string().optional(),
  image: z.string().url("URL d'image invalide"),
});

export const orderSchema = z.object({
  userId: z.string(),
  storeId: z.string(),
  total: z.number().positive(),
  deliveryFee: z.number().nonnegative(),
  paymentMethod: z.enum(['airtel', 'moov', 'cash', 'card']),
  deliveryAddress: z.string().min(5),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })).min(1),
});
