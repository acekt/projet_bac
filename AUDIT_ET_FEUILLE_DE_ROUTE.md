# Audit Technique et Feuille de Route - Mes Courses Faciles

## 1. Audit du Projet Actuel

### 1.1 Analyse de l'existant
Le projet actuel est une base de site web statique (HTML/CSS) avec un script PHP pour la gestion d'un formulaire.

**Points forts :**
- Structure de fichiers claire.
- Design CSS existant propre et responsive.
- Utilisation de variables CSS pour la charte graphique.

**Anomalies et Incohérences Techniques :**
1. **Emplacement des fichiers** : Le fichier `form.php` se trouve dans le dossier `Assets/js/`, ce qui est sémantiquement incorrect.
2. **Erreurs de code PHP (`form.php`)** :
    - Typo : `$host = 'loclahost'` au lieu de `localhost`.
    - Syntaxe SQL : `paiement; tarea` (point-virgule au lieu d'une virgule).
    - Erreur de liaison (bind_param) : 5 types spécifiés ("sssss") pour 6 variables fournies.
    - Sécurité : Absence de hachage des mots de passe (`bcrypt`).
3. **Incohérence de Branding** : Le code utilise le nom "Mes Courses Faciles" alors que le cahier des charges impose "Mes Courses Faciles".
4. **Maintenance** : L'utilisation de HTML statique rend la gestion d'un catalogue multi-magasins impossible à grande échelle. Chaque modification nécessite de modifier plusieurs fichiers HTML.

### 1.2 Incohérences avec le Cahier des Charges
- **Multi-magasins** : Le système actuel ne permet pas de filtrer réellement par magasin de manière dynamique.
- **Paiements** : Aucune intégration d'API (Airtel/Moov Money) n'est présente.
- **Gestion des Rôles** : Il n'y a pas de distinction entre l'interface Admin et Client dans le code actuel.

---

## 2. Feuille de Route pour la Migration (Next.js)

L'objectif est de passer d'une architecture "fichiers statiques + PHP" à une application web moderne Full-stack utilisant **Next.js (App Router)**.

### Phase 1 : Initialisation Technique (Semaine 1-2)
- Mise en place du projet Next.js avec TypeScript.
- Configuration de **Tailwind CSS** et **Shadcn/UI** pour l'interface.
- Mise en place de **Prisma ORM** pour la communication avec la base de données MySQL.
- Configuration de l'authentification avec **NextAuth.js** (ou équivalent).

### Phase 2 : Développement du Core (Semaine 3-6)
- **Base de données** : Création des schémas (User, Store, Product, Order, Cart).
- **Backend (API Routes)** :
    - Endpoints CRUD pour les magasins et produits.
    - Logique de gestion du panier (multi-paniers par magasin).
- **Frontend** :
    - Conversion du CSS actuel en composants Tailwind réutilisables.
    - Création des pages : Accueil, Liste des produits par magasin, Détails produit.

### Phase 3 : Fonctionnalités Avancées (Semaine 7-10)
- Intégration des APIs de paiement (CinetPay ou directement les opérateurs).
- Dashboard Administrateur pour la gestion du catalogue.
- Système de notifications (Email/SMS) pour le suivi des commandes.

### Phase 4 : Déploiement et Optimisation (Semaine 11-12)
- Déploiement sur **Vercel**.
- Optimisation SEO et performance (Core Web Vitals).
- Tests de charge et de sécurité.

---

## 3. Recommandations de l'Expert
- **Souveraineté des données** : Utiliser un VPS ou un service managé pour MySQL afin de garantir la persistance des données.
- **Sécurité** : Ne jamais stocker de mots de passe en clair. Utiliser des variables d'environnement pour les clés d'API.
- **Expérience Utilisateur** : Implémenter le "Lazy Loading" pour les images des produits afin d'améliorer la vitesse sur mobile au Gabon.
