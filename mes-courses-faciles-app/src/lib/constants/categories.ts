import { Apple, CupSoda, Sparkles, Droplets, Baby, Box } from 'lucide-react';

export interface CategoryConfig {
  name: string;
  label: string;
  color: string;
  icon: any;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  Alimentaire: {
    name: 'Alimentaire',
    label: 'Alimentaire',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10',
    icon: Apple,
  },
  Boissons: {
    name: 'Boissons',
    label: 'Boissons',
    color: 'text-sky-600 dark:text-sky-400 bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10',
    icon: CupSoda,
  },
  Hygiène: {
    name: 'Hygiène',
    label: 'Hygiène',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10',
    icon: Sparkles,
  },
  Nettoyage: {
    name: 'Nettoyage',
    label: 'Nettoyage',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10',
    icon: Droplets,
  },
  Bébé: {
    name: 'Bébé',
    label: 'Bébé',
    color: 'text-pink-600 dark:text-pink-400 bg-pink-500/5 border-pink-500/20 hover:bg-pink-500/10',
    icon: Baby,
  },
  Divers: {
    name: 'Divers',
    label: 'Divers',
    color: 'text-slate-600 dark:text-slate-400 bg-slate-500/5 border-slate-500/20 hover:bg-slate-500/10',
    icon: Box,
  }
};

export function getCategoryConfig(category: string): CategoryConfig {
  return CATEGORIES[category] || CATEGORIES.Divers;
}
