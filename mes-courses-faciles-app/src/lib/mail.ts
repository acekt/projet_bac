import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn(
    '[mail.ts] RESEND_API_KEY is not set. Emails will not be sent in this environment.'
  );
}

/**
 * Client Resend singleton.
 * Utilisé côté serveur uniquement (Server Actions, Route Handlers).
 * La clé API est chargée depuis les variables d'environnement.
 */
export const resend = new Resend(process.env.RESEND_API_KEY ?? 'no-key');

/** Adresse expéditeur vérifiée sur Resend (doit correspondre à votre domaine) */
export const FROM_EMAIL = 'Mes Courses Faciles <noreply@mesachats241.ga>';

/** Nom de l'application */
export const APP_NAME = 'Mes Courses Faciles';

/** URL publique de l'application (pour les liens dans les emails) */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
