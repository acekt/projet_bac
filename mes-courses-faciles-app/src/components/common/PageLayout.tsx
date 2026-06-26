import React from 'react';
import { PageWrapper } from './PageWrapper';

interface PageLayoutProps {
  children: React.ReactNode;
  /** Ajoute un padding vertical standard (py-12). Désactiver pour les pages qui gèrent leur propre padding. */
  withPadding?: boolean;
  className?: string;
}

/**
 * Composant wrapper centralisé pour toutes les pages secondaires du Front-Office.
 * Contient :
 * - L'animation de page (via PageWrapper)
 * - Le fond "mesh/noise" standardisé
 * - Les deux flares décoratifs absolus (primaire en haut-droite, safran en bas-gauche)
 * Cela évite la duplication de ce bloc dans chaque page.
 */
export function PageLayout({ children, withPadding = true, className = '' }: PageLayoutProps) {
  return (
    <PageWrapper>
      <div className={`min-h-screen bg-mesh bg-noise relative overflow-clip ${withPadding ? 'py-12' : ''} ${className}`}>
        {/* Flare décoratif haut-droite (couleur primaire) */}
        <div
          aria-hidden="true"
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none"
        />
        {/* Flare décoratif bas-gauche (couleur safran) */}
        <div
          aria-hidden="true"
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-safran/5 blur-[80px] pointer-events-none"
        />

        {/* Contenu de la page, positionné au-dessus des flares */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </PageWrapper>
  );
}
