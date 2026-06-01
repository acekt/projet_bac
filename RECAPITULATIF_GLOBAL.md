# Récapitulatif Global - MesAchats241

Ce document présente une vue d'ensemble des fonctionnalités, des interfaces et du parcours utilisateur de la plateforme **MesAchats241** dans son état cible final.

---

## 1. Rôle : Client (Utilisateur Final)

Le client utilise la plateforme pour consulter les produits des magasins locaux à Libreville et effectuer ses achats.

### 1.1 Fonctionnalités Clés
- **Exploration Multi-Magasins** : Consultation des enseignes disponibles (Mbolo, Géant Casino, Prix Import, etc.).
- **Recherche Intelligente** : Recherche globale par nom de produit, marque ou catégorie.
- **Filtrage par Catégorie** : Navigation simplifiée entre l'alimentaire et les produits d'entretien.
- **Gestion du Panier Unique** : Règle métier stricte interdisant le mélange de produits de magasins différents (un panier = un magasin).
- **Favoris** : Possibilité de sauvegarder des produits pour des achats futurs.
- **Tunnel d'Achat (Checkout)** : Sélection de l'adresse de livraison et du mode de paiement.
- **Paiements Flexibles** : Support du paiement à la livraison et intégration prévue des paiements mobiles (Airtel/Moov Money).
- **Suivi de Commandes** : Historique et statut en temps réel des achats effectués.

### 1.2 Liste des Interfaces (Client)
- **Accueil (`/`)** : Vitrine principale avec barre de recherche, sélection du magasin et produits vedettes.
- **Boutique (`/store/[id]`)** : Vue dédiée à un magasin spécifique affichant tout son catalogue.
- **Fiche Produit (`/product/[id]`)** : Détails complets, prix, stock et bouton d'ajout au panier.
- **Recherche (`/search`)** : Résultats filtrables suite à une requête utilisateur.
- **Panier (`/cart`)** : Récapitulatif des articles, modification des quantités et calcul du total.
- **Checkout (`/checkout`)** : Interface épurée pour finaliser la commande (Adresse -> Paiement -> Confirmation).
- **Profil (`/profile`)** : Gestion des informations personnelles.
- **Commandes (`/orders`)** : Liste historique des commandes passées.
- **Favoris (`/favorites`)** : Liste des produits marqués par le client.
- **Authentification (`/auth/login`, `/auth/register`)** : Connexion et création de compte.

### 1.3 Parcours Client (Étapes)
1. **Arrivée** : Le client arrive sur l'Accueil et choisit son magasin ou recherche directement un produit.
2. **Sélection** : Il parcourt les rayons numériques et ajoute des articles au panier.
3. **Validation Panier** : Il vérifie sa sélection dans la page Panier. Si il change de magasin, le système lui propose de vider son panier précédent.
4. **Authentification** : Si non connecté, le client est invité à se connecter ou créer un compte avant de passer au paiement.
5. **Finalisation** : Dans le tunnel de checkout (sans Navbar pour éviter les distractions), il renseigne ses informations de livraison.
6. **Confirmation** : Il reçoit une confirmation et peut suivre l'avancement de sa livraison via son profil.

---

## 2. Rôle : Administrateur (Gestionnaire)

L'administrateur gère l'aspect opérationnel de la plateforme.

### 2.1 Fonctionnalités Clés
- **Tableau de Bord (Dashboard)** : Vue d'ensemble des statistiques de vente, commandes du jour et nouveaux clients.
- **Gestion du Catalogue** : Ajout, modification et suppression de produits.
- **Gestion des Magasins** : Administration des points de vente partenaires.
- **Suivi des Commandes** : Gestion du flux logistique (En préparation, En livraison, Livré).
- **Gestion Utilisateurs** : Modération des comptes clients.

### 2.2 Liste des Interfaces (Admin)
- **Vue d'ensemble (`/admin`)** : Statistiques clés et flux d'activité récent.
- **Gestion Produits (`/admin/products`)** : Table complète avec filtres pour gérer les stocks et les prix.
- **Détails Commande (`/admin/orders/[id]`)** : Consultation et mise à jour du statut d'une commande spécifique.
- **Paramètres Magasins (`/admin/stores`)** : Configuration des horaires et emplacements des enseignes.

---

## 3. Navigation et Structure

### 3.1 Éléments de Navigation
- **Navbar (En-tête)** : Présente uniquement sur l'**Accueil** et les pages de navigation catalogue pour maximiser l'espace sur les autres interfaces. Elle contient le logo, la recherche, l'accès au panier et au profil.
- **Bottom Tab Bar (Mobile)** : Menu persistant en bas de l'écran pour une navigation fluide au pouce (Accueil, Recherche, Panier, Profil).
- **Footer (Pied de page)** : Liens légaux, réseaux sociaux et informations de contact (masqué dans le tunnel de checkout).

### 3.2 Transitions et Expérience
- **Skeleton Screens** : Affichage de structures temporaires pendant le chargement des données pour une sensation de rapidité.
- **Animations** : Transitions fluides entre les pages via Framer Motion.
- **Responsive Design** : Expérience optimisée prioritairement pour mobile (usage majoritaire au Gabon).
