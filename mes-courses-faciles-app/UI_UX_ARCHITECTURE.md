# Architecture UI/UX & Guide Visuel - Mes Courses Faciles

Ce document détaille les spécifications d'interface, la charte graphique, l'arborescence structurelle du front-end et l'orchestration de la navigation de l'application **Mes Courses Faciles**.

---

## 🎯 SECTION 1 : Le Blueprint (Arborescence Complète & Annotée)

Voici la structure complète de l'application front-end (fichiers de routes, de mise en page, de composants métiers et d'atouts publics) accompagnée de leur rôle UI/UX respectif.

```text
src/
├── app/                                        # Racine du routeur App Router de Next.js
│   ├── (auth)/                                 # Groupe de routes d'authentification (sans impact sur l'URL)
│   │   ├── auth/                               # Dossier intermédiaire pour structurer l'URL /auth/*
│   │   │   ├── login/                          # Page de connexion utilisateur
│   │   │   │   └── page.tsx                    # Rendu visuel du formulaire de connexion
│   │   │   └── register/                       # Page d'inscription utilisateur
│   │   │       └── page.tsx                    # Rendu visuel du formulaire d'inscription
│   │   └── layout.tsx                          # Layout d'authentification (fond dégradé & centrage)
│   ├── (checkout)/                             # Groupe de routes dédié au tunnel d'achat sécurisé
│   │   ├── checkout/                           # Dossier de l'URL /checkout
│   │   │   ├── page.tsx                        # Rendu du composant de Checkout principal
│   │   │   └── success/                        # Page d'affichage de succès post-commande
│   │   │       └── page.tsx                    # Rendu visuel de validation et numéro de suivi
│   │   └── layout.tsx                          # Layout d'achat (sans barre de navigation complexe, focus UX)
│   ├── (dashboard)/                            # Groupe de routes pour l'administration plateforme
│   │   └── admin/                              # Espace d'administration /admin
│   │       ├── analytics/                      # Page des statistiques commerciales
│   │       │   └── page.tsx                    # Rendu serveur de calcul des indicateurs
│   │       ├── notifications/                  # Page du journal d'alertes admin
│   │       │   └── page.tsx                    # Liste des commandes et ruptures de stock
│   │       ├── orders/                         # Gestion globale des commandes de la plateforme
│   │       │   └── page.tsx                    # Datatable interactive de suivi des livraisons
│   │       ├── products/                       # Gestion du catalogue produit
│   │       │   └── page.tsx                    # Liste des articles, ajouts, modifications et suppressions
│   │       ├── settings/                       # Configurations de la plateforme
│   │       │   └── page.tsx                    # Ajustements des frais, maintenance et profil admin
│   │       ├── stores/                         # Gestion des boutiques partenaires
│   │       │   └── page.tsx                    # Activation, suspension et création de magasins
│   │       ├── users/                          # Gestion des utilisateurs de la plateforme
│   │       │   └── page.tsx                    # Contrôle des accès et suspension de comptes clients
│   │       ├── layout.tsx                      # Layout d'administration (Barre de navigation latérale active)
│   │       ├── loading.tsx                     # Squelette de chargement globale du tableau de bord
│   │       └── page.tsx                        # Accueil admin (Statistiques d'en-tête et raccourcis)
│   ├── (main)/                                 # Groupe de routes principal (Client Front-Office)
│   │   ├── cart/                               # Page dédiée au panier d'achat mobile
│   │   │   └── page.tsx                        # Rendu du panier plein écran (pour petits écrans)
│   │   ├── favorites/                          # Page de la liste de souhaits de l'utilisateur
│   │   │   └── page.tsx                        # Grille des produits enregistrés comme favoris
│   │   ├── product/                            # Dossier de consultation produit /product/[id]
│   │   │   └── [id]/                           # Paramètre dynamique d'ID produit
│   │   │       └── page.tsx                    # Fiche produit (galerie, prix, stock, et descriptif)
│   │   ├── profile/                            # Espace utilisateur connecté
│   │   │   └── page.tsx                        # Gestion de l'adresse, historique et sécurité client
│   │   ├── search/                             # Moteur de recherche et catalogue global
│   │   │   └── page.tsx                    # Intègre la recherche et le Discovery Board
│   │   ├── store/                              # Dossier de consultation magasin /store/[id]
│   │   │   └── [id]/                           # Paramètre dynamique d'ID magasin
│   │   │       └── page.tsx                    # Catalogue dédié et présentation du magasin
│   │   ├── layout.tsx                          # Layout client (Navbar supérieure, Bottom Tab Bar et Footer)
│   │   ├── loading.tsx                         # Barre de chargement éphémère de changement de page
│   │   └── page.tsx                            # Page d'accueil client (Hero, Bento, Promos, Témoignages)
│   ├── api/                                    # Point d'entrée des Route Handlers Next.js (REST)
│   │   └── ...                                 # Endpoints documentés dans le rapport technique (Section 2)
│   ├── favicon.ico                             # Icône d'onglet de l'application
│   ├── globals.css                             # Fichier CSS global (Variables HSL, directives Tailwind)
│   ├── layout.tsx                              # Layout racine de l'application (Fonts, Providers, Toasts)
│   └── not-found.tsx                           # Page d'erreur 404 premium (Bouton retour et illustration)
│
├── components/                                 # Dossier des composants partagés
│   ├── blocks/                                 # Composants complexes assemblés par métier
│   │   ├── admin/                              # Composants exclusifs à l'administration
│   │   │   ├── AdminOrdersClient.tsx           # Client interactif pour filtrer et gérer les commandes
│   │   │   ├── AdminProductsClient.tsx         # Client de gestion de catalogue (avec suppression optimiste)
│   │   │   ├── AdminStoresClient.tsx           # Client de gestion des boutiques partenaires
│   │   │   ├── AdminUsersClient.tsx            # Client de gestion et blocage de comptes clients
│   │   │   ├── AnalyticsClient.tsx             # Graphiques interactifs Recharts de statistiques
│   │   │   ├── ClientCreateSheet.tsx           # Formulaire de création de comptes utilisateurs
│   │   │   ├── NotificationsClient.tsx         # Rendu interactif du journal de bord des alertes
│   │   │   ├── OrderDetailsSheet.tsx           # Détails d'une commande et transition de statut admin
│   │   │   ├── ProductCreateSheet.tsx          # Formulaire d'ajout de produit avec upload Cloudinary
│   │   │   ├── ProductEditSheet.tsx            # Formulaire de modification de caractéristiques de produit
│   │   │   ├── SettingsClient.tsx              # Réglages de profil et de préférences globales
│   │   │   ├── StoreCreateSheet.tsx            # Formulaire d'ajout d'une boutique partenaire
│   │   │   └── StoreEditSheet.tsx              # Formulaire de modification d'une boutique partenaire
│   │   ├── auth/                               # Composants dédiés aux authentifications
│   │   │   ├── AuthModal.tsx                   # Fenêtre modale d'authentification client (Login/Register)
│   │   │   ├── LoginForm.tsx                   # Formulaire client de connexion ajax
│   │   │   └── RegisterForm.tsx                # Formulaire client d'inscription ajax
│   │   ├── cart/                               # Composants dédiés à l'expérience d'achat
│   │   │   ├── CartDrawer.tsx                  # Tiroir latéral droit récapitulatif du panier d'achat
│   │   │   ├── CheckoutClientForm.tsx          # Formulaire d'achat client mono-page (legacy)
│   │   │   ├── CheckoutWizard.tsx              # Stepper interactif de paiement et de livraison
│   │   │   ├── DeliveryStep.tsx                # Étape 1 : Saisie de l'adresse et validation Gabon phone
│   │   │   ├── FloatingCartButton.tsx          # Bouton flottant de panier d'achat pour la version mobile
│   │   │   └── PaymentMethodStep.tsx           # Étape 2 : Choix visuel de l'opérateur de paiement
│   │   ├── catalog/                            # Composants de rendu des produits et magasins
│   │   │   ├── ProductActions.tsx              # Rendu de la quantité, de l'ajout panier et favoris
│   │   │   ├── ProductCard.tsx                 # Carte produit (survol, prix, catégorie, badges)
│   │   │   ├── ProductGallery.tsx              # Rendu d'images de produits avec vignettes de prévisualisation
│   │   │   └── StoreCard.tsx                   # Carte magasin (style, temps estimé, badge de popularité)
│   │   ├── client/                             # Composants liés au compte client
│   │   │   ├── OrderDetailsSheet.tsx           # Détails de facture et suivi d'acheminement client
│   │   │   └── ProfileClient.tsx               # Client d'onglets de profil (adresse, commandes, favoris)
│   │   ├── home/                               # Composants exclusifs à la page d'accueil
│   │   │   ├── ActiveOrderTracker.tsx          # Widget dynamique de suivi de livraison active
│   │   │   ├── HeroContent.tsx                 # En-tête immersif avec parallaxe 3D interactive
│   │   │   ├── HowItWorks.tsx                  # Bento grid explicatif avec interfaces simulées
│   │   │   ├── PromoCarousel.tsx               # Carrousel d'accueil rotatif avec transition d'images
│   │   │   ├── TestimonialsCarousel.tsx        # Carrousel d'avis clients interactif
│   │   │   └── WhyChooseUs.tsx                 # Grille des promesses avec effet de halo lumineux (glare)
│   │   └── search/                             # Composants liés à l'exploration
│   │       ├── DiscoveryBoard.tsx              # RSC d'affichage des tendances et boutiques populaires
│   │       ├── SearchContent.tsx               # Client de recherche avec debounce et abortController
│   │       └── SearchSuggestionsInput.tsx      # Champ de recherche avec autocomplétion instantanée
│   ├── common/                                 # Composants structurels réutilisables de mise en page
│   │   ├── BackButton.tsx                      # Bouton de retour en arrière avec icône
│   │   ├── DataTable.tsx                       # Tableau générique de données avec filtres et pagination
│   │   ├── ErrorBoundary.tsx                   # Captateur d'erreurs d'interface avec bouton de récupération
│   │   ├── PageHeader.tsx                      # Titre de page, description et barre d'actions
│   │   ├── PageLayout.tsx                      # Conteneur global de page pour le centrage horizontal
│   │   ├── PageWrapper.tsx                     # Wrapper d'animation Framer Motion de transition de page
│   │   └── Skeletons.tsx                       # Squelettes de chargement (Product, Store)
│   ├── layout/                                 # Composants de structure de cadres d'interface
│   │   ├── BottomTabBar.tsx                    # Barre de navigation basse pour l'ergonomie mobile
│   │   ├── Footer.tsx                          # Pied de page d'informations institutionnelles
│   │   └── public/                             # Conteneurs de navigation publique
│   │       ├── Navbar.tsx                      # Barre de navigation supérieure (Logo, Recherche, Actions)
│   │       └── UserMenus.tsx                   # Menu déroulant de profil avec règles d'accès selon le rôle
│   └── ui/                                     # Composants atomiques réutilisables (Shadcn configurés)
│       ├── ImageWithLoader.tsx                 # Image anti-crash (correction hauteur 0 SVG et fallbacks CSS)
│       └── ...                                 # Boutons, cartes, séparateurs, fenêtres modales, badges
│
└── public/                                     # Répertoire d'assets statiques servis directement
    ├── images/                                 # Placeholders de secours de l'application
    │   ├── avatar-placeholder.svg              # SVG générique de profil utilisateur
    │   ├── product-placeholder.svg             # SVG générique d'article manquant
    │   └── store-placeholder.svg               # SVG générique de boutique sans logo
    ├── manifest.json                           # Fichier de configuration PWA (couleurs, icônes, standalone)
    └── ...                                     # Fichiers SVG système (Vercel, globe, window, next)
```

---

## 🎯 SECTION 2 : Le Design System & L'Apparence Globale

Le Design System de **Mes Courses Faciles** a été conçu pour projeter une image de marque de qualité supérieure (Premium / High-End), inspirée par les lignes épurées et futuristes de plateformes comme Vercel et Linear.

---

```text
[Thème Sombre Premium] ──> [Bordures Lumineuses (white/10)] ──> [Fonds en Verre (backdrop-blur)] ──> [Glows Or & Safran]
```

---

### 1. Identité Visuelle & Charte Graphique
*   **La Philosophie Visuelle :** L'application utilise des contrastes marqués, des surfaces semi-transparentes, des ombres portées douces, et des bordures très fines pour structurer l'information. L'interface s'adapte dynamiquement en mode clair ou sombre, privilégiant des arrières-plans sombres d'une grande profondeur (`slate-950` et `slate-900`) associés à des accents colorés lumineux.
*   **Palette de Couleurs (Variables HSL de `globals.css`) :**
    *   **Brand Primary (L'Émeraude Premium) :** Utilisé pour guider l'utilisateur vers les validations de commande. Couleur de confiance et d'éco-responsabilité.
        *   HSL : `142.1 76.2% 36.3%` (équivaut à `emerald-600` en Tailwind).
    *   **Safran / Or Premium (L'Accent Chaleureux) :** Utilisé sur les boutons d'appel à l'action principaux, les badges d'offres et les points d'accroche visuels. Référence aux marchés traditionnels et au positionnement haut de gamme.
        *   Couleur Safran : `#e07a5f` ou `amber-400`/`amber-500`.
    *   **Fonds et Surfaces (Surfaces Neutres) :**
        *   Fond sombre racine : `slate-950` (`#020617`).
        *   Surfaces de cartes sombres : `slate-900/40` à `slate-900/80`.
        *   Bordures lumineuses : `white/10` (sombre) ou `slate-200/50` (clair).
*   **Typographie :**
    *   L'application s'appuie sur la police **Outfit** pour les en-têtes et les éléments de marque pour son aspect géométrique et affirmé.
    *   La police de corps de texte est **Inter** (ou système sans-serif), assurant une lisibilité maximale pour les prix, les fiches techniques et les tableaux.
*   **Espacements & Marges Systémiques :**
    *   `gap-4` à `gap-6` pour les grilles de produits et de magasins adaptatives.
    *   `p-6` à `p-8` pour l'espace intérieur des cartes et formulaires afin d'aérer les informations et d'augmenter le confort visuel.
    *   `rounded-2xl` (`1rem`) pour les boutons et petits éléments, et `rounded-[2rem]` (`2rem`) pour les cartes principales de boutiques, les bento et le widget de suivi de commande, conférant un aspect moderne et adouci.

### 2. Spécifications du Glassmorphism & Effets Visuels
Pour simuler des surfaces en verre acrylique flottant au-dessus de l'arrière-plan, l'application utilise une combinaison de classes Tailwind CSS :
*   **Fonds translucides (Glassmorphism) :**
    *   *Formule de base :* `bg-white/40 dark:bg-slate-900/35 backdrop-blur-md`
    *   *Formule prononcée (Tiroirs et Modales) :* `bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl`
*   **Bordures de reflets (Luminous Borders) :**
    *   *Formule de base :* `border border-white/20 dark:border-white/10`
    *   *Formule accentuée :* `border-luminous` (qui combine une fine bordure blanche avec une opacité variable pour accentuer le relief).
*   **Ombres de lueurs (Glow Shadows) :**
    *   *Ombre safran :* `shadow-safran-btn` (une ombre portée colorée diffuse `shadow-[#e07a5f]/20` pour faire flotter les boutons d'achat).
    *   *Lueur de surface :* `shadow-glow` (utilisé sur les champs de recherche et les cartes actives au survol : `shadow-[0_0_30px_rgba(255,255,255,0.05)]`).

### 3. Logique des Micro-interactions (Animations Framer Motion)
L'interactivité de la plateforme repose sur des animations aux courbes physiques naturelles (Spring-physics), évitant les transitions linéaires froides.
*   **Transitions de survol (Hover Actions) :**
    *   *Cartes Produits & Magasins :* Utilisation de translations verticales fluides (`whileHover={{ y: -4, scale: 1.01 }}`) associées à des transitions de type ressort amorti (`type: "spring", stiffness: 300, damping: 18`).
    *   *Spotlight de survol (WhyChooseUs) :* Halo lumineux qui suit les coordonnées exactes du pointeur de la souris (modifiées en JS sur les variables CSS `--mouse-x` et `--mouse-y`).
*   **Lévitations et Parallaxe 3D (Hero 3D) :**
    *   Calcul de l'angle d'inclinaison de la carte principale selon le mouvement de la souris à l'aide des hooks `useMotionValue` et `useTransform` :
      ```typescript
      const rotateX = useTransform(mouseY, [-250, 250], [10, -10]);
      const rotateY = useTransform(mouseX, [-250, 250], [-10, 10]);
      ```
    *   Lévitation infinie en sens opposés des cartes flottantes secondaires en exploitant des animations de translation verticale en boucle (`animate={{ y: [0, 8, 0] }}`).
*   **Transitions de pages globales (Page Cross-Fade) :**
    *   Le composant [PageWrapper.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/common/PageWrapper.tsx) intercepte les chargements de pages pour appliquer un fondu-décalage :
      ```typescript
      const pageVariants = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
      };
      ```

---

## 🎯 SECTION 3 : Cartographie des Interfaces (Assemblage & Composants)

Cette section documente la structure d'assemblage de chaque écran de l'application, décrivant la hiérarchie des composants importés.

---

### 1. Rendu du Front-Office Client

```text
+-----------------------------------------------------------------------+
|  [Navbar.tsx] (Logo, Recherche Prédictive, Raccourci Panier)           |
+-----------------------------------------------------------------------+
|  [ActiveOrderTracker.tsx] (RSC: Suivi de la commande en cours)        |
+-----------------------------------------------------------------------+
|  [HeroContent.tsx] (Immersif, Parallaxe 3D, Airtel/Moov Gold Card)    |
+-----------------------------------------------------------------------+
|  [PromoCarousel.tsx] (Diaporama, Promos fraîches)                     |
+-----------------------------------------------------------------------+
|  [HowItWorks.tsx] (Bento Grid: 3 étapes clés animées)                 |
+-----------------------------------------------------------------------+
|  [WhyChooseUs.tsx] (Grille des 4 engagements avec Spotlight Glare)    |
+-----------------------------------------------------------------------+
|  [TestimonialsCarousel.tsx] (Carrousel de retours clients)            |
+-----------------------------------------------------------------------+
|  [Footer.tsx] (Informations légales et liens support)                 |
+-----------------------------------------------------------------------+
```

#### A. L'Écran d'Accueil Client
*   **Fichier Racine :** `src/app/(main)/page.tsx`
*   **Structure d'empilement des composants :**
    1.  `PageLayout` (Conteneur structurel de centrage).
    2.  `ActiveOrderTracker` (Widget dynamique serveur de suivi de livraison).
    3.  `HeroContent` (Colonne gauche textuelle & colonne droite scène 3D animée).
    4.  `PromoCarousel` (Carrousel d'accueil affichant des promotions).
    5.  `HowItWorks` (Bento Grid présentant les 3 étapes d'achat).
    6.  `WhyChooseUs` (Grille d'engagements de service avec effets de halo lumineux).
    7.  `TestimonialsCarousel` (Avis et retours clients).

#### B. La Fiche Produit
*   **Fichier Racine :** `src/app/(main)/product/[id]/page.tsx`
*   **Structure d'empilement :**
    1.  `BackButton` (Retour au catalogue).
    2.  `ProductGallery` (Affichage de l'image principale avec les miniatures cliquables).
    3.  `ProductActions` (Sélecteur de quantité numérique, bouton d'ajout panier et favoris).

#### C. La Recherche et le Catalogue
*   **Fichier Racine :** `src/app/(main)/search/page.tsx`
*   **Structure d'empilement :**
    1.  `SearchContent` (Client de recherche intelligent).
        *   *En mode vide :* suggestions, catégories, et injection du slot serveur `DiscoveryBoard` (contenant `TrendingProductsSection` et `PopularStoresSection` sous `<Suspense>`).
        *   *En mode saisie :* Grille dynamique de composants `ProductCard`.

---

### 2. Le Panier & Le Tunnel d'Achat

#### A. Le Tiroir de Panier (Off-canvas)
*   **Fichier Racine :** `src/components/blocks/cart/CartDrawer.tsx`
*   **Composants intégrés :**
    1.  `Sheet` & `SheetContent` (Structure coulissante).
    2.  Boucle sur les articles :
        *   `ImageWithLoader` (Rendu de l'image miniature du produit).
        *   Ajusteur de quantité (Boutons Plus, Moins, Supprimer).
    3.  Section Totaux (Sous-total, Frais de livraison, Total final).
    4.  CTA "Passer à la caisse" (Redirige vers `/checkout` et ferme le tiroir).

#### B. L'Entonnoir d'Achat (Checkout Wizard)
*   **Fichier Racine :** `src/app/(checkout)/checkout/page.tsx`
*   **Structure d'empilement :**
    1.  `BackButton` (Retour à l'accueil).
    2.  `CheckoutWizard` (Composant maître coordonnant le formulaire et le résumé).
        *   *Étape 1 (Livraison) :* `DeliveryStep` (Formulaire réceptacle validé par Zod).
        *   *Étape 2 (Paiement) :* `PaymentMethodStep` (Grille des options de paiement, Airtel, Moov, Carte, Cash).
        *   *Résumé de commande (Sticky à droite) :* Carte récapitulative des articles avec `ImageWithLoader` et totaux finaux.

---

### 3. Le Tableau de Bord d'Administration (Back-Office)

#### A. La Mise en Page Administrative (Layout)
*   **Fichier Racine :** `src/app/(dashboard)/admin/layout.tsx`
*   **Structure d'empilement :**
    1.  **Barre latérale de navigation (Sidebar) :** Contient les liens de navigation (/admin, /admin/orders, /admin/products, /admin/stores, /admin/users, /admin/notifications, /admin/settings) avec surbrillance de l'onglet actif et boutons de déconnexion.
    2.  **Cadre de contenu (Main Frame) :** Conteneur adaptatif à défilement indépendant intégrant un en-tête d'administration (titre, profil abrégé et badge d'alertes en temps réel).

#### B. La Gestion du Catalogue Produit
*   **Fichier Racine :** `src/app/(dashboard)/admin/products/page.tsx`
*   **Structure d'empilement :**
    1.  `PageHeader` (Titre "Produits" et bouton "Nouveau Produit" qui injecte le paramètre d'URL `?new=product`).
    2.  `AdminProductsClient` (Composant client de gestion de catalogue).
        *   `DataTable` (Tableau paginé affichant les produits, stocks et prix).
        *   `ProductCreateSheet` (Panneau coulissant droit de création de produit).
        *   `ProductEditSheet` (Panneau coulissant de modification de produit).
        *   `AlertDialog` (Boîte de confirmation de suppression).

---

## 🎯 SECTION 4 : Navigation, Routage & États de Chargement

L'architecture technique de navigation et de rendu de l'application s'appuie sur les dernières fonctionnalités de Next.js pour assurer un chargement fluide.

---

### 1. Le Routage Systémique (Next.js App Router)
L'application exploite les groupes de routes pour cloisonner proprement les mises en page et la logique d'autorisation :
*   **Client Front-Office (`(main)`) :**
    *   Configure un layout racine commun contenant la barre de navigation supérieure [Navbar.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/layout/public/Navbar.tsx) (avec gestion dynamique de session), la barre basse mobile [BottomTabBar.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/layout/BottomTabBar.tsx) et le pied de page [Footer.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/layout/Footer.tsx).
*   **Espace d'Administration (`(dashboard)`) :**
    *   Mise en page épurée axée sur le contrôle (Sidebar à gauche, zone de contenu à droite).
    *   Toutes les routes de ce groupe sont surveillées par le middleware. Si un utilisateur n'a pas le rôle `ADMIN` dans son cookie de session, il est redirigé de force vers l'accueil.
*   **Authentification (`(auth)`) :**
    *   Layout minimaliste centrant les formulaires de connexion et d'inscription sur un fond dégradé, masquant les barres de navigation globales pour éviter les distractions.

### 2. Gestion des Composants Off-canvas et Modales
L'application favorise des ouvertures coulissantes ("Off-canvas") pour ne pas casser le contexte de navigation de l'utilisateur :
*   **Les Tiroirs Coulissants (`Sheet` de Shadcn) :**
    *   Utilisés pour le panier d'achat ([CartDrawer.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/blocks/cart/CartDrawer.tsx)) et pour les fiches de création/édition de l'administration (`ProductCreateSheet`, `StoreCreateSheet`).
    *   Ces tiroirs glissent depuis la droite sur desktop et s'adaptent en plein écran sur les mobiles. Ils s'appuient sur un arrière-plan flouté sombre (`bg-slate-950/80 backdrop-blur-sm`) pour isoler le panneau.
*   **Les Fenêtres Modales d'Authentification (`Dialog` / `AuthModal`) :**
    *   Si l'utilisateur tente de valider son panier ou d'ajouter des favoris sans être connecté, l'application n'effectue pas de redirection brutale. Elle ouvre une modale d'authentification [AuthModal.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/blocks/auth/AuthModal.tsx) au-dessus de la page courante, permettant à l'utilisateur de se connecter et de poursuivre son action sans perdre son contexte d'achat.

### 3. Stratégie de Chargement Progressif (Streaming, Loading & Suspense)
Pour offrir un temps de chargement perçu immédiat, l'application évite d'attendre la résolution complète des requêtes de base de données (MySQL sur TiDB Cloud) avant d'afficher la page.

```text
[Next.js App Build] 
       │
       ├──> Chargement immédiat du squelette HTML statique (Navbar, Layout)
       │
       ├──> Streaming progressif des données lourdes (Prisma MySQL)
       │         │
       │         ├──> Rendu initial : <Suspense fallback={<ProductSkeleton />}>
       │         │
       │         └──> Rendu final : Données résolues et affichage des cartes réelles
```

*   **Rendu de Squelettes de Chargement (Skeletons) :**
    *   L'application utilise les squelettes animés de [Skeletons.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/common/Skeletons.tsx). Ces formes grises claires pulsent de manière infinie pour simuler l'emplacement futur des produits et des magasins.
*   **Fichiers `loading.tsx` :**
    *   Chaque dossier majeur (client principal, espace d'administration) possède son propre fichier `loading.tsx`. Next.js affiche instantanément ce composant dès qu'un changement de page est détecté, évitant de bloquer le navigateur sur un écran blanc pendant que le serveur génère la page.
*   **Utilisation des balises `<Suspense>` :**
    *   Dans le composant [DiscoveryBoard.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/app-cadalix/projet_bac/mes-courses-faciles-app/src/components/blocks/search/DiscoveryBoard.tsx), les sections `TrendingProductsSection` (tendances) et `PopularStoresSection` (magasins populaires) effectuent des lectures en base de données.
    *   En les enveloppant dans des balises `<Suspense fallback={<DiscoverySkeleton />}>`, le serveur Next.js envoie immédiatement le squelette HTML de la page de recherche au navigateur client. Le serveur maintient la connexion ouverte et "streame" (envoie au fil de l'eau) les produits et les magasins dès que Prisma a résolu les données de la base MySQL. L'utilisateur peut ainsi commencer à interagir avec le champ de recherche avant même que les tendances en bas de page ne soient totalement chargées.
