"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/context/ToastContext';
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';

interface PaymentMethodStepProps {
  totalAmount: number;
  onBack: () => void;
  onSubmit: (method: 'airtel' | 'moov' | 'card' | 'cash') => Promise<void>;
  isProcessing: boolean;
}

export function PaymentMethodStep({
  totalAmount,
  onBack,
  onSubmit,
  isProcessing
}: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<'airtel' | 'moov' | 'card' | 'cash' | undefined>(undefined);
  const toast = useToast();

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un moyen de paiement.");
      return;
    }
    onSubmit(selectedMethod);
  };

  const methods = [
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      icon: Smartphone,
      description: 'Paiement instantané via votre compte Airtel',
      color: 'text-red-600',
      activeBorder: 'border-red-600 dark:border-red-500',
      activeBg: 'bg-red-50/50 dark:bg-red-950/10',
      badge: 'API intégrée',
      badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    },
    {
      id: 'moov' as const,
      name: 'Moov Money',
      icon: Smartphone,
      description: 'Paiement sécurisé par code Flooz / Moov',
      color: 'text-blue-600',
      activeBorder: 'border-blue-600 dark:border-blue-500',
      activeBg: 'bg-blue-50/50 dark:bg-blue-950/10',
      badge: 'API intégrée',
      badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'card' as const,
      name: 'Carte Bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard - Passerelle sécurisée 3DS',
      color: 'text-slate-800 dark:text-slate-200',
      activeBorder: 'border-slate-800 dark:border-slate-300',
      activeBg: 'bg-slate-50/50 dark:bg-slate-800/20',
      badge: 'Passerelle 3DS',
      badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    },
    {
      id: 'cash' as const,
      name: 'Paiement à la livraison',
      icon: Wallet,
      description: 'Payez en espèces lors de la réception de votre colis',
      color: 'text-emerald-600',
      activeBorder: 'border-emerald-600 dark:border-emerald-500',
      activeBg: 'bg-emerald-50/50 dark:bg-emerald-950/10',
      badge: 'Validation manuelle',
      badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    }
  ];

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <CreditCard size={18} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Moyen de paiement</h2>
      </div>

      <div className="space-y-4">
        <RadioGroup
          disabled={isProcessing}
          onValueChange={(value) => setSelectedMethod(value as any)}
          value={selectedMethod}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {methods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const Icon = method.icon;
            return (
              <Label
                key={method.id}
                className={`relative flex flex-col items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-muted/50'
                } ${
                  isSelected
                    ? `${method.activeBorder} ${method.activeBg} shadow-sm`
                    : 'border-border/50 bg-card'
                }`}
              >
                <RadioGroupItem value={method.id} className="sr-only" />
                
                {/* Method Header */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-background border border-border/50 ${isSelected ? 'shadow-inner' : ''}`}>
                      <Icon size={24} className={method.color} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-foreground text-base">{method.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.badgeBg}`}>
                    {method.badge}
                  </span>
                </div>

                {/* Method Description */}
                <p className="text-xs text-muted-foreground leading-relaxed pr-6">
                  {method.description}
                </p>

                {isSelected && (
                  <div className="absolute bottom-4 right-4 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                )}
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Info Badge */}
      <div className="p-4 bg-muted/40 dark:bg-slate-800/10 rounded-2xl border border-border/50 flex items-start gap-3">
        <Lock className="text-primary flex-shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vos données de transaction sont entièrement protégées. Pour les paiements Airtel et Moov, vous recevrez une invite de validation de transaction sur votre téléphone.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border/50">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          disabled={isProcessing}
          className="h-14 px-6 rounded-2xl border-slate-200 dark:border-white/10 font-bold flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Retour
        </Button>
        <Button
          type="submit"
          disabled={!selectedMethod || isProcessing}
          className="h-14 px-8 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20 flex items-center justify-center gap-2 flex-1 md:flex-none"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Traitement en cours...
            </>
          ) : (
            <>
              Confirmer et payer {totalAmount.toLocaleString('fr-FR')} CFA
              <ChevronRight size={18} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
