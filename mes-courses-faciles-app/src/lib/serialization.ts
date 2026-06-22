/**
 * src/lib/serialization.ts
 * ─────────────────────────────────────────────────────────────
 * Utilitaire de sérialisation sécurisée des données Prisma.
 *
 * Problème : Next.js App Router refuse de passer des objets contenant
 * des types non-primitifs (Date, Decimal, Buffer) à travers la boundary
 * Server→Client (RSC). Cela cause des erreurs silencieuses ou des écrans
 * blancs sans stack trace explicite.
 *
 * Solution : Convertir tous les objets Prisma en objets JSON purs avant
 * de les retourner depuis une Server Action ou un Server Component.
 *
 * Principe SRP : Ce module est la seule autorité de sérialisation de l'app.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Convertit récursivement un objet Prisma en objet JSON pur.
 *
 * Transformations appliquées :
 *  - `Date`    → string ISO 8601  (ex: "2026-06-22T11:00:00.000Z")
 *  - `BigInt`  → number           (risque de perte de précision pour > 2^53)
 *  - `Buffer`  → string base64    (cas des champs Bytes dans Prisma)
 *  - `undefined` → null           (JSON.stringify supprime les undefined)
 *  - Tout autre type primitif → inchangé
 *
 * @param data - Objet ou valeur retournée par Prisma
 * @returns    - Objet JSON pur, sérialisable par Next.js RSC boundary
 */
export function sanitizePrismaData<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  if (typeof data === 'bigint') {
    return Number(data) as unknown as T;
  }

  if (Buffer.isBuffer(data)) {
    return data.toString('base64') as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizePrismaData) as unknown as T;
  }

  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        sanitizePrismaData(value),
      ])
    ) as T;
  }

  return data;
}

/**
 * Version typée pour les cas où le retour doit être un tableau.
 * Sucre syntaxique pour éviter le cast `as T` au point d'appel.
 */
export function sanitizePrismaArray<T>(data: T[]): T[] {
  return data.map(sanitizePrismaData);
}
