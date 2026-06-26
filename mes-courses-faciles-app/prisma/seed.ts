import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('=== DEBUT DE L\'ENRICHISSEMENT DE LA BASE DE DONNEES ===');

  // Chargement de la configuration des images premium
  const configPath = path.join(__dirname, '../images-assets-config.json');
  let config: any = { stores: {}, products: {} };
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log('✓ Configuration des images premium chargée avec succès.');
  } catch (error) {
    console.error('⚠ Impossible de charger la configuration des images, fallbacks par défaut utilisés.', error);
  }

  // ========================================================
  // ÉTAPE 1 : Nettoyage Complet et Ordonné (Teardown)
  // ========================================================
  console.log('1. Nettoyage de la base de données (Zero-Trust)...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✓ Tables nettoyées avec succès.');

  // ========================================================
  // ÉTAPE 2 : Seeding des Comptes Utilisateurs (Users)
  // ========================================================
  console.log('2. Génération des utilisateurs (Admins & Clients)...');
  
  // Hachage unique pour accélérer l'exécution du script
  const hashedPassword = await bcrypt.hash('password123', 10);
  const clientHashedPassword = await bcrypt.hash('Client12345', 10);
  const adminHashedPassword = await bcrypt.hash('Admin12345', 10);

  // Génération de 3 Administrateurs
  const adminsData = [
    { id: randomUUID(), name: 'Christ APINDA', email: 'admin@mcf.com', password: adminHashedPassword, role: Role.ADMIN, phone: '+241066000000' },
    { id: randomUUID(), name: 'Jules Nguema', email: 'jules@mcf.com', password: hashedPassword, role: Role.ADMIN, phone: '+241066112233' },
    { id: randomUUID(), name: 'Sarah Bongo', email: 'sarah@mcf.com', password: hashedPassword, role: Role.ADMIN, phone: '+241077112233' }
  ];

  // Génération de 15 Clients Réalistes
  const clientsData = [
    { id: randomUUID(), name: 'Emma', email: 'client@mcf.com', password: clientHashedPassword, role: Role.CLIENT, phone: '+241066554433', address: 'Libreville, Louis' },
    { id: randomUUID(), name: 'Marie Mba', email: 'marie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077112244', address: 'Libreville, Glass' },
    { id: randomUUID(), name: 'Paul Obiang', email: 'paul@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077223355', address: 'Libreville, Nzeng-Ayong' },
    { id: randomUUID(), name: 'Jean-Pierre Ndong', email: 'jean-pierre@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077334466', address: 'Libreville, Oloumi' },
    { id: randomUUID(), name: 'Christian Nguema', email: 'christian@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066778899', address: 'Libreville, Angondjé' },
    { id: randomUUID(), name: 'Sophie Bongo', email: 'sophie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066889900', address: 'Libreville, Akébé' },
    { id: randomUUID(), name: 'Marc Koumba', email: 'marc@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066223344', address: 'Libreville, Charbonnages' },
    { id: randomUUID(), name: 'Sylvie Mombo', email: 'sylvie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066334455', address: 'Libreville, Louis' },
    { id: randomUUID(), name: 'Alain Moussavou', email: 'alain@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066445566', address: 'Libreville, Oloumi' },
    { id: randomUUID(), name: 'Patricia Makaya', email: 'patricia@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077445577', address: 'Libreville, Lalala' },
    { id: randomUUID(), name: 'Charles Boulingui', email: 'charles@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077556688', address: 'Libreville, Glass' },
    { id: randomUUID(), name: 'Florence Kombila', email: 'florence@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077667799', address: 'Libreville, Nzeng-Ayong' },
    { id: randomUUID(), name: 'Eric Bekale', email: 'eric@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066998877', address: 'Libreville, Angondjé' },
    { id: randomUUID(), name: 'Valerie Angoue', email: 'valerie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066887766', address: 'Libreville, Akébé' },
    { id: randomUUID(), name: 'Sandrine Ntsame', email: 'sandrine@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077889911', address: 'Libreville, Charbonnages' }
  ];

  await prisma.user.createMany({
    data: [...adminsData, ...clientsData]
  });

  const emmaUser = clientsData.find(c => c.email === 'client@mcf.com')!;
  const createdClients = clientsData;
  console.log(`✓ ${adminsData.length} Administrateurs et ${clientsData.length} Clients insérés (dont Emma).`);

  // ========================================================
  // ÉTAPE 3 : Seeding des Magasins (Stores)
  // ========================================================
  console.log('3. Génération des magasins partenaires (10 magasins)...');

  const storeDefinitions = [
    { id: randomUUID(), name: 'Mbolo Supermarché', address: 'Boulevard Triomphal, Libreville', district: 'Mbolo', phone: '+24111740001', logo: config.stores['Mbolo Supermarché']?.url || '/images/store-placeholder.svg', description: 'Le plus grand supermarché historique de Libreville. Alimentation générale, fruits et légumes.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Géant Casino', address: 'Avenue de Cointet, Libreville', district: 'Glass', phone: '+24111760002', logo: config.stores['Géant Casino']?.url || '/images/store-placeholder.svg', description: 'Produits frais, épicerie fine et importations de qualité supérieure.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Prix Import', address: 'Zone Industrielle Oloumi, Libreville', district: 'Oloumi', phone: '+24111720022', logo: config.stores['Prix Import']?.url || '/images/store-placeholder.svg', description: 'Le supermarché discount n°1 pour faire de grandes économies sur vos courses.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'San Gel', address: 'Avenue de Cointet, Libreville', district: 'Glass', phone: '+24111760021', logo: config.stores['San Gel']?.url || '/images/store-placeholder.svg', description: 'Le spécialiste des surgelés, viandes et poissons frais à Libreville.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Hygiène & Beauté MCF', address: 'Carrefour Angondjé, Libreville', district: 'Angondjé', phone: '+24111700024', logo: config.stores['Hygiène & Beauté MCF']?.url || '/images/store-placeholder.svg', description: 'Produits de douche, soins corporels, capillaires et bien-être.', isActive: true, isDeleted: false, category: 'Hygiène' },
    { id: randomUUID(), name: 'Marché de Louis', address: 'Carrefour Louis, Libreville', district: 'Louis', phone: '+24111780023', logo: config.stores['Marché de Louis']?.url || '/images/store-placeholder.svg', description: 'Épicerie fine, légumes locaux de qualité et produits frais de saison.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Bébé & Maman Libreville', address: 'Avenue des Mines, Libreville', district: 'Oloumi', phone: '+24111750026', logo: config.stores['Bébé & Maman Libreville']?.url || '/images/store-placeholder.svg', description: 'Couches, laits de croissance, petits pots et accessoires pour votre bébé.', isActive: true, isDeleted: false, category: 'Bébé' },
    { id: randomUUID(), name: 'Supergros Grossiste', address: 'Centre-ville, Libreville', district: 'Centre-ville', phone: '+24111710025', logo: config.stores['Supergros Grossiste']?.url || '/images/store-placeholder.svg', description: 'Achat en gros de riz, huiles, pâtes et produits d\'alimentation générale.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Boulangerie Pâtisserie MCF', address: 'Rond-point des Charbonnages, Libreville', district: 'Charbonnages', phone: '+24111730027', logo: config.stores['Boulangerie Pâtisserie MCF']?.url || '/images/store-placeholder.svg', description: 'Pains chauds, viennoiseries et pâtisseries maison faites avec amour.', isActive: true, isDeleted: false, category: 'Alimentaire' },
    { id: randomUUID(), name: 'Clean Gabon', address: 'Carrefour Akébé, Libreville', district: 'Akébé', phone: '+24111790028', logo: config.stores['Clean Gabon']?.url || '/images/store-placeholder.svg', description: 'Lessives, produits d\'entretien et tout le nécessaire de nettoyage de maison.', isActive: true, isDeleted: false, category: 'Nettoyage' }
  ];

  const storesData = storeDefinitions.map(({ category, ...storeData }) => storeData);
  await prisma.store.createMany({
    data: storesData
  });

  const createdStores = storeDefinitions;
  console.log(`✓ ${createdStores.length} Magasins insérés dans la base de données.`);

  // ========================================================
  // ÉTAPE 4 : Seeding du Catalogue Produits (Product)
  // ========================================================
  console.log('4. Génération du catalogue produits (15 à 20 produits par magasin)...');
  
  const productTemplates: Record<string, { name: string; description: string; basePrice: number; unit: string }[]> = {
    'Alimentaire': [
      { name: 'Riz Parfumé Premium 5kg', description: 'Riz blanc long grain parfumé de qualité supérieure.', basePrice: 4800, unit: 'sac' },
      { name: 'Huile de Tournesol 1L', description: 'Huile végétale pour friture saine et assaisonnement.', basePrice: 1250, unit: 'bouteille' },
      { name: 'Lait Demi-Écrémé UHT 1L', description: 'Lait de vache demi-écrémé stérilisé.', basePrice: 850, unit: 'brique' },
      { name: 'Spaghetti blé dur 500g', description: 'Pâtes de qualité supérieure, cuisson 8 minutes.', basePrice: 600, unit: 'paquet' },
      { name: 'Café Arabica Pur 250g', description: 'Café moulu arômes intenses de caféiers de montagne.', basePrice: 2400, unit: 'paquet' },
      { name: 'Thé Vert Menthe (25 s.)', description: 'Boîte de 25 sachets de thé vert parfumé à la menthe.', basePrice: 1500, unit: 'boîte' },
      { name: 'Farine de Blé T55 1kg', description: 'Farine de blé fine idéale pour gâteaux et pain.', basePrice: 750, unit: 'paquet' },
      { name: 'Sucre Blanc Morceaux 1kg', description: 'Sucre de canne raffiné en morceaux réguliers.', basePrice: 1100, unit: 'boîte' },
      { name: 'Beurre Doux 250g', description: 'Beurre fin de table, goût riche et onctueux.', basePrice: 1750, unit: 'pièce' },
      { name: 'Confiture de Fraise 370g', description: 'Préparée avec 50% de fruits mûrs sélectionnés.', basePrice: 1650, unit: 'pot' },
      { name: 'Poulet Surgelé Entier 1.3kg', description: 'Poulet prêt à cuire élevé en plein air.', basePrice: 3500, unit: 'pièce' },
      { name: 'Œufs Frais du Gabon (x30)', description: 'Plateau de 30 œufs de ferme calibre moyen.', basePrice: 3200, unit: 'plateau' },
      { name: 'Sardines Pimentées (boîte)', description: 'Sardines entières à l\'huile avec une pointe de piment.', basePrice: 750, unit: 'boîte' },
      { name: 'Biscuits Sablés Beurre', description: 'Sablés traditionnels fondants et croustillants.', basePrice: 950, unit: 'paquet' },
      { name: 'Yaourts aux Fruits (x4)', description: 'Assortiment de 4 yaourts crémeux aux fruits.', basePrice: 1400, unit: 'pack' },
      { name: 'Sel Fin de Table 1kg', description: 'Sel marin fin enrichi en iode pour la cuisine.', basePrice: 350, unit: 'paquet' },
      { name: 'Pain de Mie Tranché', description: 'Pain de mie nature extra moelleux, idéal pour toasts.', basePrice: 1200, unit: 'paquet' },
      { name: 'Baguette de Pain MCF', description: 'Baguette de pain blanc croustillante, cuite sur place.', basePrice: 150, unit: 'pièce' },
      { name: 'Croissant au Beurre', description: 'Viennoiserie pur beurre croustillante et fondante.', basePrice: 400, unit: 'pièce' }
    ],
    'Boissons': [
      { name: 'Jus d\'Orange Pur 1L', description: 'Jus de fruits fraîchement pressés, sans sucres ajoutés.', basePrice: 1300, unit: 'brique' },
      { name: 'Eau Minérale Locale 1.5L', description: 'Eau de source naturelle purifiée en bouteille.', basePrice: 400, unit: 'bouteille' },
      { name: 'Soda Coca-Cola 1.5L', description: 'Boisson rafraîchissante aux extraits végétaux.', basePrice: 1100, unit: 'bouteille' },
      { name: 'Bière Régab (canette 33cl)', description: 'Bière blonde gabonaise emblématique et rafraîchissante.', basePrice: 600, unit: 'canette' },
      { name: 'Eau Gazeuse 1L', description: 'Eau minérale pétillante pour une fraîcheur intense.', basePrice: 800, unit: 'bouteille' },
      { name: 'Vin Rouge Bordeaux 75cl', description: 'Vin de Bordeaux équilibré aux arômes de fruits rouges.', basePrice: 4500, unit: 'bouteille' }
    ],
    'Hygiène': [
      { name: 'Shampoing Doux Aloe Vera', description: 'Nourrit et apporte brillance aux cheveux normaux.', basePrice: 3800, unit: 'flacon' },
      { name: 'Gel Douche Hydratant 400ml', description: 'Parfum frais et vivifiant pour un réveil énergique.', basePrice: 2900, unit: 'flacon' },
      { name: 'Huile de Coco Vierge 250ml', description: 'Huile de coco pure pour soins capillaires et corporels.', basePrice: 4800, unit: 'flacon' },
      { name: 'Lait Corporel Karité 250ml', description: 'Nourrit intensément les peaux sèches et déshydratées.', basePrice: 5500, unit: 'flacon' },
      { name: 'Crème Mains Réparatrice', description: 'Soin concentré pour mains sèches et abîmées.', basePrice: 3200, unit: 'tube' },
      { name: 'Crème Hydratante Visage 50ml', description: 'Soin hydratant protecteur quotidien, texture légère.', basePrice: 11500, unit: 'pot' },
      { name: 'Crème Solaire Visage SPF50', description: 'Haute protection UV non grasse pour le visage.', basePrice: 9800, unit: 'tube' }
    ],
    'Nettoyage': [
      { name: 'Lessive Liquide Machine 3L', description: 'Lessive concentrée pour un linge blanc éclatant et coloré.', basePrice: 6500, unit: 'bidon' },
      { name: 'Liquide Vaisselle Citron 1L', description: 'Dégraisse en profondeur et laisse un parfum de citron frais.', basePrice: 1400, unit: 'bouteille' },
      { name: 'Eau de Javel 2L', description: 'Solution désinfectante multi-usages pour toute la maison.', basePrice: 1800, unit: 'bouteille' },
      { name: 'Nettoyant Multi-Surfaces 1L', description: 'Nettoie, dégraisse et fait briller toutes les surfaces lavables.', basePrice: 2200, unit: 'bouteille' }
    ],
    'Bébé': [
      { name: 'Couches Bébé Taille 4 (x50)', description: 'Couches ultra absorbantes offrant jusqu\'à 12h de protection.', basePrice: 9500, unit: 'paquet' },
      { name: 'Lait 1er Âge Poudre 800g', description: 'Formule infantile complète pour nourrissons de 0 à 6 mois.', basePrice: 6800, unit: 'boîte' },
      { name: 'Lingettes Bébé Sensitives (x80)', description: 'Lingettes biodégradables sans parfum pour peaux sensibles.', basePrice: 1800, unit: 'paquet' },
      { name: 'Shampoing Bébé Sans Larmes', description: 'Nettoie en douceur les cheveux délicats des bébés.', basePrice: 2200, unit: 'flacon' }
    ]
  };

  const productsToCreate: any[] = [];

  for (const store of createdStores) {
    // Déterminer les catégories de produits à ajouter à ce magasin
    let categoriesToSeed: string[] = [];
    if (['Mbolo Supermarché', 'Géant Casino', 'Prix Import'].includes(store.name)) {
      categoriesToSeed = ['Alimentaire', 'Boissons', 'Hygiène', 'Nettoyage', 'Bébé'];
    } else if (store.name === 'San Gel') {
      categoriesToSeed = ['Alimentaire', 'Boissons'];
    } else if (store.name === 'Marché de Louis') {
      categoriesToSeed = ['Alimentaire', 'Boissons'];
    } else if (store.name === 'Supergros Grossiste') {
      categoriesToSeed = ['Alimentaire', 'Boissons'];
    } else if (store.name === 'Boulangerie Pâtisserie MCF') {
      categoriesToSeed = ['Alimentaire', 'Boissons'];
    } else if (store.name === 'Bébé & Maman Libreville') {
      categoriesToSeed = ['Bébé', 'Hygiène'];
    } else if (store.name === 'Hygiène & Beauté MCF') {
      categoriesToSeed = ['Hygiène'];
    } else if (store.name === 'Clean Gabon') {
      categoriesToSeed = ['Nettoyage'];
    } else {
      categoriesToSeed = ['Alimentaire'];
    }

    for (const cat of categoriesToSeed) {
      const templates = productTemplates[cat] || [];
      for (const temp of templates) {
        // Variation de prix (+/- 12%)
        const priceVariation = 0.88 + Math.random() * 0.24;
        const finalPrice = Math.round((temp.basePrice * priceVariation) / 50) * 50; // arrondi à 50 FCFA
        
        // Stock : 15% de chance de rupture de stock (0), sinon entre 10 et 200 unités
        const isOutOfStock = Math.random() < 0.15;
        const stock = isOutOfStock ? 0 : Math.floor(10 + Math.random() * 190);

        const productImg = config.products[temp.name]?.url || '/images/product-placeholder.svg';
        productsToCreate.push({
          id: randomUUID(),
          name: temp.name,
          description: temp.description,
          price: finalPrice,
          stock: stock,
          unit: temp.unit,
          category: cat,
          images: JSON.stringify([productImg]),
          storeId: store.id,
          isActive: true,
          isDeleted: false
        });
      }
    }
  }

  // Insertion en masse via createMany pour optimiser les performances de TiDB
  await prisma.product.createMany({
    data: productsToCreate
  });

  // Récupération de tous les produits créés
  const allProducts = await prisma.product.findMany({});
  console.log(`✓ ${allProducts.length} Produits insérés dans le catalogue.`);

  // ========================================================
  // ÉTAPE 5 : Seeding des Commandes (Orders & OrderItem)
  // ========================================================
  console.log('5. Génération de l\'historique des commandes (50 commandes)...');
  
  // Associer les produits par magasin pour simuler des commandes cohérentes (panier mono-boutique)
  const storeProductsMap = new Map<string, any[]>();
  for (const p of allProducts) {
    if (!storeProductsMap.has(p.storeId)) {
      storeProductsMap.set(p.storeId, []);
    }
    storeProductsMap.get(p.storeId)!.push(p);
  }

  const activeStoreIds = Array.from(storeProductsMap.keys());
  const allStatuses = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
  const paymentMethods = ['cash', 'airtel', 'moov', 'card'];

  const ordersToCreate: any[] = [];
  const orderItemsToCreate: any[] = [];

  // 1. Commandes Spécifiques pour Emma (client@mcf.com) pour valider l'UI ActiveOrderTracker et l'Historique
  if (emmaUser) {
    console.log('Génération des commandes tests critiques pour Emma...');

    // A. Une commande active (PAID) très récente chez Mbolo Supermarché pour le ActiveOrderTracker
    const mboloStore = createdStores.find(s => s.name === 'Mbolo Supermarché') || createdStores[0];
    const mboloProducts = storeProductsMap.get(mboloStore.id)!;
    
    // Panier de 2 produits
    const emmaActiveItems = [
      { product: mboloProducts[0], qty: 2 },
      { product: mboloProducts[1], qty: 1 }
    ];

    const deliveryFee = 2000;
    let itemsTotal = 0;
    const activeOrderId = randomUUID();
    
    for (const item of emmaActiveItems) {
      itemsTotal += item.product.price * item.qty;
      orderItemsToCreate.push({
        id: randomUUID(),
        orderId: activeOrderId,
        productId: item.product.id,
        quantity: item.qty,
        price: item.product.price
      });
    }

    const activeOrderDate = new Date(); // aujourd'hui
    ordersToCreate.push({
      id: activeOrderId,
      userId: emmaUser.id,
      storeId: mboloStore.id,
      total: itemsTotal + deliveryFee,
      deliveryFee,
      status: OrderStatus.PAID,
      paymentMethod: 'airtel',
      deliveryAddress: 'Emma - +241066554433 - Libreville, quartier Louis, Villa MCF',
      createdAt: activeOrderDate,
      updatedAt: activeOrderDate
    });

    // B. Trois commandes passées (DELIVERED) plus anciennes pour l'onglet historique du profil
    for (let k = 0; k < 3; k++) {
      const randomStoreId = activeStoreIds[k % activeStoreIds.length];
      const storeProducts = storeProductsMap.get(randomStoreId)!;
      const product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
      
      const qty = Math.floor(Math.random() * 2) + 1;
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - (5 + k * 8)); // il y a 5, 13 et 21 jours
      const orderId = randomUUID();

      ordersToCreate.push({
        id: orderId,
        userId: emmaUser.id,
        storeId: randomStoreId,
        total: (product.price * qty) + deliveryFee,
        deliveryFee,
        status: OrderStatus.DELIVERED,
        paymentMethod: paymentMethods[k % paymentMethods.length],
        deliveryAddress: 'Emma - +241066554433 - Libreville, quartier Louis, Villa MCF',
        createdAt: orderDate,
        updatedAt: orderDate
      });

      orderItemsToCreate.push({
        id: randomUUID(),
        orderId,
        productId: product.id,
        quantity: qty,
        price: product.price
      });
    }
    console.log('✓ Commandes tests d\'Emma préparées.');
  }

  // 2. Commandes Aléatoires Restantes pour atteindre au moins 50 commandes totales
  const ordersNeeded = 50 - ordersToCreate.length;
  console.log(`Génération de ${ordersNeeded} autres commandes aléatoires...`);

  for (let i = 0; i < ordersNeeded; i++) {
    // Pick a random client
    const client = createdClients[i % createdClients.length];
    
    // Pick a random store
    const storeId = activeStoreIds[Math.floor(Math.random() * activeStoreIds.length)];
    const storeProducts = storeProductsMap.get(storeId)!;

    // Pick 1 to 3 random products from this store
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    const tempStoreProducts = [...storeProducts];

    for (let j = 0; j < itemCount && tempStoreProducts.length > 0; j++) {
      const randIdx = Math.floor(Math.random() * tempStoreProducts.length);
      selectedProducts.push(tempStoreProducts.splice(randIdx, 1)[0]);
    }

    const deliveryFee = 2000;
    let itemsTotal = 0;
    const orderId = randomUUID();

    for (const p of selectedProducts) {
      const qty = Math.floor(Math.random() * 2) + 1;
      itemsTotal += p.price * qty;
      orderItemsToCreate.push({
        id: randomUUID(),
        orderId,
        productId: p.id,
        quantity: qty,
        price: p.price
      });
    }

    // Random status
    const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    // Random date over the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);

    ordersToCreate.push({
      id: orderId,
      userId: client.id,
      storeId,
      total: itemsTotal + deliveryFee,
      deliveryFee,
      status,
      paymentMethod,
      deliveryAddress: `${client.name} - ${client.phone} - ${client.address || 'Libreville, Gabon'}`,
      createdAt: orderDate,
      updatedAt: orderDate
    });
  }

  // Insertion en masse dans l'ordre pour respecter l'intégrité référentielle
  await prisma.order.createMany({
    data: ordersToCreate
  });
  await prisma.orderItem.createMany({
    data: orderItemsToCreate
  });

  console.log(`✓ ${ordersToCreate.length} Commandes simulées au total.`);

  // ========================================================
  // ÉTAPE 6 : Seeding des Notifications Administrateur
  // ========================================================
  console.log('6. Génération des notifications d\'administration...');
  
  const notificationAlerts = [
    { type: 'ORDER', message: 'Nouvelle commande reçue chez Mbolo Supermarché.', reference: 'notif-order-mbolo-1' },
    { type: 'STOCK', message: 'Alerte : Stock faible pour "Riz Parfumé Premium 5kg" chez Mbolo Supermarché.', reference: 'notif-stock-mbolo-1' },
    { type: 'ORDER', message: 'Nouvelle commande payée en attente chez Hygiène & Beauté MCF.', reference: 'notif-order-hygiene-1' },
    { type: 'STOCK', message: 'Rupture de stock signalée pour "Couches Bébé Taille 4 (x50)" chez Bébé & Maman Libreville.', reference: 'notif-stock-bebe-1' },
    { type: 'ORDER', message: 'Commande annulée par l\'acheteur Paul Obiang.', reference: 'notif-order-cancel-1' }
  ];

  const notificationsToCreate = notificationAlerts.map(alert => ({
    id: randomUUID(),
    type: alert.type,
    message: alert.message,
    reference: alert.reference,
    isRead: false
  }));

  await prisma.notification.createMany({
    data: notificationsToCreate
  });

  console.log('✓ Notifications administratives créées.');
  console.log('=== SEEDING TERMINE AVEC SUCCES ===');
}

main()
  .catch((e) => {
    console.error('Erreur durant le seeding de la base de données :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
