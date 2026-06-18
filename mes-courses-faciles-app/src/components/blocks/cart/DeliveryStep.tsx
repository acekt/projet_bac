"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronRight } from 'lucide-react';

// Gabon phone regex: supports +241 or 0 prefix followed by 5/6/7 and 7 to 8 digits (allowing spaces/dashes)
const gabonPhoneRegex = /^(?:\+241[\s.-]?|0)[\s.-]?[567](?:[\s.-]?\d){7,8}$/;

export const deliveryStepSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  phone: z.string().regex(
    gabonPhoneRegex,
    "Format de téléphone Gabon invalide. Ex: +241 66 12 34 56 ou 066 12 34 56"
  ),
  district: z.string().min(2, "Le quartier de Libreville est requis"),
  indications: z.string().optional(),
});

export type DeliveryFormData = z.infer<typeof deliveryStepSchema>;

interface DeliveryStepProps {
  initialData?: Partial<DeliveryFormData>;
  onNext: (data: DeliveryFormData) => void;
}

export function DeliveryStep({ initialData, onNext }: DeliveryStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryStepSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      district: initialData?.district || '',
      indications: initialData?.indications || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <MapPin size={18} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Informations de livraison</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground font-bold uppercase text-xs tracking-wider">
            Nom Complet
          </Label>
          <Input
            id="name"
            placeholder="Jean Dupont"
            {...register('name')}
            className={`h-12 bg-muted/50 border-transparent focus:bg-background ${
              errors.name ? 'border-destructive focus:ring-destructive' : 'focus:border-primary'
            }`}
          />
          {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground font-bold uppercase text-xs tracking-wider">
            Téléphone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="066 12 34 56"
            {...register('phone')}
            className={`h-12 bg-muted/50 border-transparent focus:bg-background ${
              errors.phone ? 'border-destructive focus:ring-destructive' : 'focus:border-primary'
            }`}
          />
          {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>}
        </div>

        {/* District Field */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="district" className="text-muted-foreground font-bold uppercase text-xs tracking-wider">
            Quartier (Libreville)
          </Label>
          <Input
            id="district"
            placeholder="Ex: Louis, Glass, Angondjé..."
            {...register('district')}
            className={`h-12 bg-muted/50 border-transparent focus:bg-background ${
              errors.district ? 'border-destructive focus:ring-destructive' : 'focus:border-primary'
            }`}
          />
          {errors.district && <p className="text-xs text-destructive font-medium">{errors.district.message}</p>}
        </div>

        {/* Indications Field */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="indications" className="text-muted-foreground font-bold uppercase text-xs tracking-wider">
            Indications complémentaires (Optionnel)
          </Label>
          <Input
            id="indications"
            placeholder="Ex: Maison bleue après la pharmacie"
            {...register('indications')}
            className="h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary"
          />
        </div>
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          disabled={!isValid}
          className="w-full h-14 text-base rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 group font-bold transition-all flex items-center justify-center gap-2"
        >
          Continuer vers le paiement
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </form>
  );
}
