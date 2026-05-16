# Audit Technique Approfondi & Feuille de Route de Migration
## Projet : Mes Courses Faciles (Gabon)

---

## 1. Diagnostic de l'Existant (Legacy)

### 1.1 Analyse des Anomalies et Incohérences
L'analyse des fichiers source originaux (HTML/CSS/PHP) a révélé des lacunes critiques qui justifient une refonte totale :

#### **A. Erreurs de Développement (Bugs)**
- **Incohérence Formulaire/PHP (`Inscription.html` vs `form.php`)** :
    - Le formulaire utilise l'attribut `name="Prenom"` (majuscule) alors que le PHP attend `$_POST['prenom']` (minuscule).
    - Le champ de message s'appelle `name="message"` dans le HTML mais le PHP cherche `$_POST['tarea']`.
    - Le groupe radio pour le paiement s'appelle `name="genre"` (confusion sémantique probable avec le genre/sexe) au lieu de `paiement`.
- **Failles SQL Graves (`form.php`)** :
    - Utilisation de `mysqli_prepare` avec une syntaxe SQL invalide : `paiement; tarea` au lieu de `paiement, tarea`.
    - Erreur de liaison de paramètres : `bind_param("sssss", ...)` ne fournit que 5 types pour 6 variables, ce qui provoquera un crash à l'exécution.
- **Chemins de fichiers** : Utilisation de chemins absolus comme `/Assets/Css/...` qui peuvent poser problème selon la configuration du serveur web (racine du projet).

#### **B. Sécurité**
- **Mots de passe** : Le script PHP actuel tente d'enregistrer les mots de passe en clair dans la base de données. C'est une faille de sécurité majeure.
- **Injections SQL** : Bien que `mysqli_prepare` soit utilisé, la logique globale manque de validation et d'assainissement des entrées (sanitization).

#### **C. Architecture & UX**
- **Multi-magasins** : L'implémentation actuelle est purement visuelle (balise `<select>` statique). Il n'y a aucune logique derrière pour filtrer les produits en fonction du magasin sélectionné.
- **Redondance** : Les fichiers `alimentaire.html` et `netoyage.html` dupliquent la structure du header et du footer, rendant la maintenance extrêmement laborieuse.

---

## 2. Audit de la Base Next.js (Dossier `mes-courses-faciles-app/`)

### 2.1 Points Positifs
- **Stack Moderne** : Next.js 15, React 19, Tailwind CSS 4, Prisma 6.
- **Structure API** : Une API d'inscription (`/api/auth/register`) est déjà présente et gère correctement le hachage des mots de passe avec `bcrypt`.
- **Modèle de données** : Le schéma Prisma est robuste et couvre les besoins multi-magasins, commandes et paniers.

### 2.2 Points d'Amélioration Immédiats
- **Routing** : La page d'accueil (`src/app/page.tsx`) doit être développée pour remplacer `projet.html`.
- **Gestion d'état** : Nécessité d'implémenter un store (Zustand ou Context API) pour gérer le magasin sélectionné et le panier de manière persistante.
- **PWA** : La configuration PWA n'est pas encore amorcée.

---

## 3. Feuille de Route : Stratégie "Big Bang" (12 Semaines)

### Phase 1 : Consolidation du Socle (Semaines 1-2)
- **Base de données** : Migration du schéma Prisma vers MySQL.
- **Authentification** : Intégration de NextAuth.js pour gérer les sessions (Client vs Admin).
- **Design System** : Conversion des styles CSS existants en composants Tailwind réutilisables (Button, Card, Navbar, Footer).

### Phase 2 : Core E-commerce (Semaines 3-6)
- **Catalogue Dynamique** : Affichage des produits filtrés par `storeId` et `category`.
- **Système de Panier** : Gestion du panier en local storage avec synchronisation en base de données pour les utilisateurs connectés.
- **Dashboard Admin** : Interface simple pour permettre la saisie manuelle des produits et stocks par magasin.

### Phase 3 : Intégration Paiement & Mobile (Semaines 7-10)
- **CinetPay** : Implémentation du tunnel d'achat et liaison avec l'API CinetPay pour Airtel/Moov Money.
- **PWA Setup** : Configuration de `next-pwa`, création du manifeste et des icônes, gestion du mode hors-ligne pour la consultation du catalogue.
- **Notifications** : Mise en place des Web Push pour le suivi des commandes.

### Phase 4 : Finalisation & Qualité (Semaines 11-12)
- **SEO & Performance** : Optimisation des images (Next/Image) et des Meta-tags.
- **Tests** : Tests de bout en bout (Cypress ou Playwright) sur le tunnel de commande.
- **Déploiement** : Mise en production sur Vercel ou VPS avec Docker.

---

## 4. Recommandations de l'Expert
1. **Priorité Sécurité** : Finaliser l'authentification avant d'ouvrir le dashboard admin.
2. **Optimisation Mobile** : Utiliser des images compressées (WebP) car le débit data au Gabon peut être coûteux pour l'utilisateur.
3. **Paiement** : Prévoir un mode "Paiement à la livraison" comme option de repli si la passerelle de paiement rencontre des problèmes techniques.
