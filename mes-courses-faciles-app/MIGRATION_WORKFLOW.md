# Guide de Migration de Base de Données - TiDB & Prisma

Ce guide décrit le workflow rigoureux que notre équipe doit suivre pour modifier le schéma de la base de données (TiDB) via Prisma, dans le but de garantir un déploiement sécurisé avec **Zero Downtime** et d'éviter tout verrouillage ou crash en production.

---

## 🛠️ Concepts Clés : `db push` vs `migrate deploy`

| Commande | Usage | Comportement en Production | Risque de Panne |
| :--- | :--- | :--- | :--- |
| **`npx prisma db push`** | Développement rapide | Compare le schéma local et applique directement les changements sans historique. | **TRÈS ÉLEVÉ** (Risque de suppression de colonnes/tables et perte de données). |
| **`npx prisma migrate deploy`** | Déploiement CI/CD (Prod) | Applique les fichiers SQL enregistrés dans `prisma/migrations` dans l'ordre chronologique. | **MINIME** (Déterministe, basé sur un historique audité). |

---

## 🔄 Workflow de Développement Local

Lorsqu'un développeur doit modifier la structure de la base de données, il doit impérativement suivre les étapes suivantes **sur sa machine locale** avant d'envoyer son code sur GitHub/Netlify.

### Étape 1 : Modification locale du schéma
Modifiez le fichier `prisma/schema.prisma` selon vos besoins (ajout de champ, table, index, etc.).

### Étape 2 : Création de la migration locale
Exécutez la commande suivante dans votre terminal local :
```bash
npx prisma migrate dev --name <nom_explicit_de_la_migration>
```
*Exemple : `npx prisma migrate dev --name add_user_role`*

**Ce que fait cette commande :**
1. Elle compare votre `schema.prisma` avec votre base de données locale.
2. Elle génère un fichier SQL dans `prisma/migrations/<timestamp>_<nom_de_la_migration>/migration.sql`.
3. Elle applique cette migration sur votre base de données locale.
4. Elle regénère le client Prisma local (`@prisma/client`).

### Étape 3 : Audit du fichier SQL généré (Crucial)
Ouvrez le fichier SQL généré sous `prisma/migrations/.../migration.sql` et vérifiez :
* **Pas de suppression destructrice accidentelle** (ex. `DROP COLUMN` sur une table contenant des données).
* **Pas d'opérations lourdes bloquantes** sur de grandes tables (bien que TiDB gère le DDL en ligne de manière asynchrone, les opérations volumineuses comme l'ajout d'index uniques ou le changement de types de colonnes doivent être surveillées).

> [!WARNING]
> Si une migration implique de renommer ou de supprimer une colonne utilisée en production, vous devez appliquer le **Pattern Expand & Contract** (voir section ci-dessous).

### Étape 4 : Validation locale
Lancez l'application en local et validez que tout fonctionne :
```bash
npm run dev
```

### Étape 5 : Commit et Push
Ajoutez les fichiers modifiés à Git (incluant le dossier `prisma/migrations` !) et poussez vos changements :
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): <nom_de_la_migration>"
git push origin main
```

---

## 🚀 Processus de Déploiement en Production (Netlify)

Notre script de build Netlify est désormais configuré de la manière suivante dans le fichier `package.json` :
```json
"build": "prisma migrate deploy && prisma generate && next build"
```

Lors du déploiement :
1. **`prisma migrate deploy`** applique les nouveaux fichiers SQL de migration sur la base de données de production TiDB.
2. **`prisma generate`** génère le client Prisma avec les nouveaux types.
3. **`next build`** compile le code de l'application Next.js avec les nouveaux types et schémas validés.

*Si les migrations échouent, le build de production s'arrête immédiatement avant que le nouveau code ne soit déployé, évitant ainsi toute désynchronisation.*

---

## 🛡️ Stratégies Zero Downtime avec TiDB (Best Practices)

### 1. Le Pattern Expand & Contract (Pour renommer ou supprimer)
Pour modifier ou supprimer un champ sans casser l'application en cours d'exécution :
1. **Expand (Déploiement N)** : Ajoutez le nouveau champ dans `schema.prisma`. Déployez. Écrivez dans les deux champs dans votre code d'application (Double Écriture).
2. **Backfill** : Migrez les anciennes données vers le nouveau champ en tâche de fond.
3. **Contract (Déploiement N+1)** : Modifiez le code pour ne lire/écrire que sur le nouveau champ. Supprimez l'ancien champ du `schema.prisma` et déployez la migration de suppression.

### 2. Spécificités de TiDB
* **Online DDL** : TiDB prend en charge les modifications de schéma en ligne sans verrouiller les tables en lecture/écriture pour la plupart des opérations. Cependant, l'ajout d'une clé primaire ou la modification de types de données incompatibles peut être bloquant ou coûteux en ressources.
* **Éviter les transactions volumineuses** : Évitez de combiner des modifications de schéma massives dans une seule migration. Divisez-les en petites migrations si nécessaire.
