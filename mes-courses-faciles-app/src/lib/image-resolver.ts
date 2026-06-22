/**
 * image-resolver.ts
 * ─────────────────────────────────────────────────────────────
 * Single Source of Truth pour la résolution des URLs d'images.
 *
 * Règles de résolution (dans l'ordre de priorité) :
 *  1. path null / undefined / vide → placeholder SVG local
 *  2. chaîne JSON stringifiée (ex: '["url1","url2"]') → première URL extraite
 *  3. chemin local déjà valide  → retourné tel quel
 *  4. URL externe (http/https)  → retournée telle quelle
 *  5. Tout autre cas imprévu    → placeholder SVG local
 * ─────────────────────────────────────────────────────────────
 */

export type ImageType = 'store' | 'product' | 'avatar';

/** Chemins absolus des placeholders dans /public */
const PLACEHOLDERS: Record<ImageType, string> = {
  store:   '/images/store-placeholder.svg',
  product: '/images/product-placeholder.svg',
  avatar:  '/images/avatar-placeholder.svg',
};

/**
 * Résout un chemin d'image brut (tel que stocké en DB) en une URL
 * utilisable directement dans un attribut `src`.
 *
 * @param path  - Valeur brute issue de la base de données (peut être null,
 *                une URL, un chemin local, ou un JSON stringifié).
 * @param type  - Type d'asset pour choisir le bon placeholder de secours.
 * @returns     - Une URL absolue ou un chemin local toujours valide.
 */
export function resolveImageUrl(
  path: string | null | undefined,
  type: ImageType,
): string {
  const placeholder = PLACEHOLDERS[type];

  // ── Étape 1 : Guard null / undefined / chaîne vide ──────────
  if (!path) return placeholder;

  // ── Étape 2 : Nettoyage des espaces ─────────────────────────
  const cleaned = path.trim();
  if (!cleaned) return placeholder;

  // ── Étape 3 : Désérialisation JSON (images[] stocké en string) ──
  // Prisma stocke `images` comme JSON.stringify([...]) dans la DB.
  // On tente de parser si la chaîne ressemble à un tableau JSON.
  if (cleaned.startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = String(parsed[0]).trim();
        return first || placeholder;
      }
      // Tableau vide → placeholder
      return placeholder;
    } catch {
      // Pas du JSON valide → on continue avec la chaîne brute
    }
  }

  // ── Étape 4 : Chemin local (commence par '/') ────────────────
  if (cleaned.startsWith('/')) return cleaned;

  // ── Étape 5 : URL externe (http / https) ────────────────────
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  // ── Étape 6 : Cas imprévu → placeholder ─────────────────────
  return placeholder;
}

/**
 * Détermine si un chemin résolu pointe vers un asset local.
 * Utilisé pour décider si next/image doit être `unoptimized`.
 *
 * Next.js ne peut pas optimiser les SVG locaux : leur pipeline
 * interne génère une image vide pour les fichiers sans dimensions
 * intrinsèques. `unoptimized` bypasse ce pipeline et sert le fichier
 * brut depuis /public, ce qui est le comportement attendu.
 */
export function isLocalPath(url: string): boolean {
  return url.startsWith('/');
}
