import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DEBUT DU SEEDING DE STRESS-TEST ---');

  // ==========================================
  // ÉTAPE 1 : Nettoyage Sécurisé (Teardown)
  // ==========================================
  console.log('1. Nettoyage des tables de la base de données...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Tables nettoyées.');

  // ==========================================
  // ÉTAPE 2 : Seeding des Utilisateurs (Users)
  // ==========================================
  console.log('2. Génération des utilisateurs...');
  
  // Garde-fou 1 : Hachage unique réutilisable pour optimiser le temps d'exécution
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Super Admin
  await prisma.user.create({
    data: {
      name: 'Christ APINDA',
      email: 'admin@mcf.com',
      password: hashedPassword,
      phone: '+241066000000',
      role: 'ADMIN',
    },
  });

  // 20 clients distincts avec numéros gabonais
  const clientNames = [
    'Marie Mba', 'Paul Obiang', 'Jean-Pierre Ndong', 'Christian Nguema',
    'Sophie Bongo', 'Marc Koumba', 'Sylvie Mombo', 'Alain Moussavou',
    'Patricia Makaya', 'Charles Boulingui', 'Florence Kombila', 'Eric Bekale',
    'Valerie Angoue', 'Patrick Meyo', 'Sandrine Ntsame', 'David Obame',
    'Chantal Ogoula', 'Antoine Ovono', 'Beatrice Essono', 'Georges Agaya'
  ];

  const clients = [];
  for (let i = 0; i < clientNames.length; i++) {
    const name = clientNames[i];
    const email = `client${i + 1}@mcf.com`;
    // Format Gabon (+241 06... ou +241 07...)
    const phonePrefix = i % 2 === 0 ? '+24106' : '+24107';
    const phoneDigits = String(100000 + i * 137).padStart(6, '0');
    const formattedPhone = `${phonePrefix}${phoneDigits}`;
    
    const client = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: formattedPhone,
        role: 'CLIENT',
        address: `Libreville, ${['Glass', 'Louis', 'Oloumi', 'Nzeng-Ayong', 'Angondjé', 'Akébé', 'Charbonnages'][i % 7]}`,
      },
    });
    clients.push(client);
  }

  console.log(`Utilisateurs créés : 1 Admin et ${clients.length} Clients.`);

  // ==========================================
  // ÉTAPE 3 : Seeding des Magasins (Stores)
  // ==========================================
  console.log('3. Génération des 20 magasins (17 actifs, 3 inactifs/supprimés)...');
  
  const storeDefinitions = [
    // 17 Magasins Actifs
    { name: 'Mbolo Supermarché', address: 'Boulevard Triomphal, Libreville', district: 'Mbolo', phone: '+24111740001', logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200&auto=format&fit=crop', description: 'Le plus grand supermarché historique de Libreville.', isActive: true, isDeleted: false },
    { name: 'Géant Casino', address: 'Avenue de Cointet, Libreville', district: 'Glass', phone: '+24111760002', logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=200&auto=format&fit=crop', description: 'Produits importés et locaux de qualité supérieure.', isActive: true, isDeleted: false },
    { name: 'Prix Import Oloumi', address: 'Zone Industrielle d\'Oloumi, Libreville', district: 'Oloumi', phone: '+24111720003', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop', description: 'Vos courses au meilleur prix de gros et détail.', isActive: true, isDeleted: false },
    { name: 'Supergros Oloumi', address: 'Avenue des Mines, Libreville', district: 'Oloumi', phone: '+24111750004', logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=200&auto=format&fit=crop', description: 'Alimentation générale de gros et demi-gros.', isActive: true, isDeleted: false },
    { name: 'Pharmacie de la Poste', address: 'Place de l\'Indépendance, Libreville', district: 'Centre-ville', phone: '+24111710005', logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop', description: 'Votre santé est notre priorité. Ouverte 24h/24.', isActive: true, isDeleted: false },
    { name: 'Pharmacie d\'Oloumi', address: 'Carrefour Oloumi, Libreville', district: 'Oloumi', phone: '+24111720006', logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&auto=format&fit=crop', description: 'Médicaments, parapharmacie et conseils médicaux.', isActive: true, isDeleted: false },
    { name: 'Pharmacie des Charbonnages', address: 'Rond-point des Charbonnages, Libreville', district: 'Charbonnages', phone: '+24111730007', logo: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=200&auto=format&fit=crop', description: 'Grande pharmacie desservant le nord de Libreville.', isActive: true, isDeleted: false },
    { name: 'Épicerie du Rond-point', address: 'Rond-point de Nzeng-Ayong, Libreville', district: 'Nzeng-Ayong', phone: '+24111770008', logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200&auto=format&fit=crop', description: 'Fruits, légumes frais et épicerie fine au cœur de Nzeng-Ayong.', isActive: true, isDeleted: false },
    { name: 'Alimentation Générale Louis', address: 'Quartier Louis, Libreville', district: 'Louis', phone: '+24111780009', logo: 'https://images.unsplash.com/photo-1601599561233-608357f7df08?q=80&w=200&auto=format&fit=crop', description: 'Épicerie de quartier, boissons fraîches et conserves.', isActive: true, isDeleted: false },
    { name: 'Mini Prix Akébé', address: 'Carrefour Akébé, Libreville', district: 'Akébé', phone: '+24111790010', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop', description: 'Produits ménagers et de consommation courante à bas prix.', isActive: true, isDeleted: false },
    { name: 'Supermarché CKG Angondjé', address: 'Voie Express Angondjé, Libreville', district: 'Angondjé', phone: '+24111700011', logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200&auto=format&fit=crop', description: 'Large sélection de produits locaux et cosmétiques.', isActive: true, isDeleted: false },
    { name: 'Pharmacie de Glass', address: 'Boulevard de l\'Impératrice, Libreville', district: 'Glass', phone: '+24111760012', logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbab9?q=80&w=200&auto=format&fit=crop', description: 'Tous vos médicaments et produits de santé à Glass.', isActive: true, isDeleted: false },
    { name: 'Boulangerie l\'Épi d\'Or', address: 'Rue Principale de Louis, Libreville', district: 'Louis', phone: '+24111780013', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', description: 'Pain chaud croustillant, viennoiseries et pâtisseries locales.', isActive: true, isDeleted: false },
    { name: 'La Cave de Libreville', address: 'Montée de Louis, Libreville', district: 'Louis', phone: '+24111780014', logo: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop', description: 'Vins fins, champagnes et spiritueux de prestige.', isActive: true, isDeleted: false },
    { name: 'Marché aux Fruits Oloumi', address: 'Avenue de la Nation, Libreville', district: 'Oloumi', phone: '+24111720015', logo: 'https://images.unsplash.com/photo-1610397613090-a9c6c8632fbe?q=80&w=200&auto=format&fit=crop', description: 'Fruits exotiques frais et légumes de saison du Gabon.', isActive: true, isDeleted: false },
    { name: 'Pharmacie d\'Angondjé', address: 'Carrefour Château, Libreville', district: 'Angondjé', phone: '+24111700016', logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&auto=format&fit=crop', description: 'Pharmacie moderne avec des conseils spécialisés.', isActive: true, isDeleted: false },
    { name: 'Alimentation du Port', address: 'Zone Portuaire, Libreville', district: 'Glass', phone: '+24111760017', logo: 'https://images.unsplash.com/photo-1601599561233-608357f7df08?q=80&w=200&auto=format&fit=crop', description: 'Produits d\'épicerie générale et maritimes.', isActive: true, isDeleted: false },
    
    // 3 Magasins Inactifs ou Supprimés
    { name: 'Boutique de Lalala', address: 'Quartier Lalala, Libreville', district: 'Lalala', phone: '+24111710018', logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200&auto=format&fit=crop', description: 'Boutique de vêtements fermée temporairement pour travaux.', isActive: false, isDeleted: false },
    { name: 'Pharmacie de Louis (Ancienne)', address: 'Carrefour Louis, Libreville', district: 'Louis', phone: '+24111780019', logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbab9?q=80&w=200&auto=format&fit=crop', description: 'Établissement fermé définitivement.', isActive: false, isDeleted: false },
    { name: 'Épicerie Disparue', address: 'Carrefour Nzeng-Ayong, Libreville', district: 'Nzeng-Ayong', phone: '+24111770020', logo: 'https://images.unsplash.com/photo-1601599561233-608357f7df08?q=80&w=200&auto=format&fit=crop', description: 'Magasin supprimé de la base de données.', isActive: false, isDeleted: true },
  ];

  const stores = [];
  for (const sDef of storeDefinitions) {
    const store = await prisma.store.create({ data: sDef });
    stores.push(store);
  }

  console.log(`Magasins créés : ${stores.length} magasins.`);

  // ==========================================
  // ÉTAPE 4 : Seeding du Catalogue (Products)
  // ==========================================
  console.log('4. Génération des produits (entre 3 et 5 par magasin actif)...');
  
  const activeStores = stores.filter(s => s.isActive && !s.isDeleted);
  const allProducts: any[] = [];

  for (const store of activeStores) {
    let productsToCreate: any[] = [];
    
    if (store.name.includes('Pharmacie')) {
      productsToCreate = [
        { name: 'Paracétamol 500mg', description: 'Boîte de 20 comprimés pour soulager la douleur et la fièvre.', price: 1500, category: 'Santé', stock: 180, unit: 'boîte', images: JSON.stringify(['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400']) },
        { name: 'Ibuprofène 400mg', description: 'Anti-inflammatoire pour soulager les maux de tête et courbatures.', price: 2500, category: 'Santé', stock: 120, unit: 'boîte', images: JSON.stringify(['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400']) },
        { name: 'Vitamine C 1000mg', description: 'Comprimés effervescents pour stimuler le système immunitaire.', price: 3000, category: 'Santé', stock: 90, unit: 'tube', images: JSON.stringify(['https://images.unsplash.com/photo-1616679911721-fe6eec10f0cd?q=80&w=400']) },
        { name: 'Thermomètre Digital', description: 'Mesure rapide et précise de la température corporelle.', price: 4500, category: 'Santé', stock: 45, unit: 'pièce', images: JSON.stringify(['https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400']) },
      ];
    } else if (store.name.includes('Boulangerie')) {
      productsToCreate = [
        { name: 'Baguette Traditionnelle', description: 'Pain frais cuit sur place chaque matin.', price: 150, category: 'Alimentaire', stock: 250, unit: 'pièce', images: JSON.stringify(['https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400']) },
        { name: 'Croissant pur Beurre', description: 'Viennoiserie feuilletée croustillante.', price: 500, category: 'Alimentaire', stock: 80, unit: 'pièce', images: JSON.stringify(['https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400']) },
        { name: 'Pain au Chocolat', description: 'Viennoiserie feuilletée fourrée au chocolat.', price: 600, category: 'Alimentaire', stock: 80, unit: 'pièce', images: JSON.stringify(['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=400']) },
      ];
    } else if (store.name.includes('Cave')) {
      productsToCreate = [
        { name: 'Bordeaux Rouge AOC', description: 'Vin rouge équilibré, parfait pour accompagner vos viandes.', price: 8500, category: 'Boissons', stock: 65, unit: 'bouteille', images: JSON.stringify(['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400']) },
        { name: 'Champagne Brut Sélection', description: 'Champagne de prestige pour vos célébrations.', price: 25000, category: 'Boissons', stock: 35, unit: 'bouteille', images: JSON.stringify(['https://images.unsplash.com/photo-1594487540886-4a65c8101790?q=80&w=400']) },
        { name: 'Bière Régab 65cl', description: 'Bière blonde locale gabonaise rafraîchissante.', price: 1000, category: 'Boissons', stock: 400, unit: 'bouteille', images: JSON.stringify(['https://images.unsplash.com/photo-1608270176050-12ec057de178?q=80&w=400']) },
      ];
    } else if (store.name.includes('Fruits')) {
      productsToCreate = [
        { name: 'Régime de Bananes Plantains', description: 'Bananes vertes à cuire, récoltées localement.', price: 2500, category: 'Alimentaire', stock: 50, unit: 'régime', images: JSON.stringify(['https://images.unsplash.com/photo-1566393028639-d108a42c46a7?q=80&w=400']) },
        { name: 'Ananas Victoria', description: 'Ananas sucré et juteux du Gabon.', price: 1200, category: 'Alimentaire', stock: 75, unit: 'pièce', images: JSON.stringify(['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=400']) },
        { name: 'Avocats du Gabon 1kg', description: 'Avocats crémeux récoltés localement.', price: 2000, category: 'Alimentaire', stock: 40, unit: 'kg', images: JSON.stringify(['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400']) },
      ];
    } else {
      // Supermarchés et Épiceries standards
      productsToCreate = [
        { name: 'Riz Long Grain 5kg', description: 'Riz blanc de qualité supérieure.', price: 4500, category: 'Alimentaire', stock: 150, unit: 'sac', images: JSON.stringify(['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400']) },
        { name: 'Lait Demi-Écrémé 1L', description: 'Lait de vache UHT demi-écrémé.', price: 850, category: 'Alimentaire', stock: 350, unit: 'brique', images: JSON.stringify(['https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400']) },
        { name: 'Huile de Tournesol 1L', description: 'Huile végétale pour friture et assaisonnement.', price: 1200, category: 'Alimentaire', stock: 120, unit: 'bouteille', images: JSON.stringify(['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400']) },
        { name: 'Eau Minérale 1.5L', description: 'Eau minérale naturelle locale en bouteille.', price: 400, category: 'Boissons', stock: 600, unit: 'bouteille', images: JSON.stringify(['https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=400']) },
        { name: 'Café Arabica 250g', description: 'Café moulu pur arabica de qualité.', price: 2400, category: 'Alimentaire', stock: 100, unit: 'paquet', images: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400']) },
      ];
    }

    for (const pData of productsToCreate) {
      const product = await prisma.product.create({
        data: {
          ...pData,
          storeId: store.id,
        },
      });
      allProducts.push(product);
    }
  }

  console.log(`Catalogue créé : ${allProducts.length} produits insérés.`);

  // ==========================================
  // ÉTAPE 5 : Seeding des Commandes (Orders & Items)
  // ==========================================
  console.log('5. Génération de 27 commandes réparties historiquement sur 90 jours...');
  
  // Organiser les produits par magasin pour simuler des commandes cohérentes (panier d'un seul magasin à la fois)
  const storeProductsMap = new Map<string, any[]>();
  for (const p of allProducts) {
    if (!storeProductsMap.has(p.storeId)) {
      storeProductsMap.set(p.storeId, []);
    }
    storeProductsMap.get(p.storeId)!.push(p);
  }

  const activeStoreIds = Array.from(storeProductsMap.keys());
  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const paymentMethods = ['cash', 'airtel', 'moov', 'card'];

  let ordersCreatedCount = 0;

  for (let i = 0; i < 27; i++) {
    const client = clients[i % clients.length];
    const storeId = activeStoreIds[i % activeStoreIds.length];
    const storeProducts = storeProductsMap.get(storeId)!;
    
    // Sélectionner entre 1 et 3 produits aléatoires de ce magasin
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const selectedProducts: any[] = [];
    const tempProducts = [...storeProducts];
    
    for (let j = 0; j < numProducts && tempProducts.length > 0; j++) {
      const idx = Math.floor(Math.random() * tempProducts.length);
      selectedProducts.push(tempProducts.splice(idx, 1)[0]);
    }

    const deliveryFee = 2000;
    let itemsTotal = 0;
    
    const orderItemsData = selectedProducts.map(p => {
      const qty = Math.floor(Math.random() * 3) + 1; // Quantité de 1 à 3
      itemsTotal += p.price * qty;
      return {
        productId: p.id,
        quantity: qty,
        price: p.price,
      };
    });

    const total = itemsTotal + deliveryFee;
    const status = statuses[i % statuses.length];
    const method = paymentMethods[i % paymentMethods.length];

    // Garde-fou 2 : Distribution temporelle sur 90 jours
    const randomDaysAgo = Math.floor(Math.random() * 90);
    const createdAtDate = new Date();
    createdAtDate.setDate(createdAtDate.getDate() - randomDaysAgo);

    await prisma.order.create({
      data: {
        userId: client.id, // Garde-fou 3 : Liaison séquentielle avec l'ID réel du parent
        storeId: storeId,
        total: total,
        deliveryFee: deliveryFee,
        status: status as any,
        paymentMethod: method,
        deliveryAddress: `${client.name} - ${client.phone} - ${client.address || 'Libreville, Gabon'}`,
        createdAt: createdAtDate,
        updatedAt: createdAtDate,
        orderItems: {
          create: orderItemsData,
        },
      },
    });
    
    ordersCreatedCount++;
  }

  console.log(`Commandes créées : ${ordersCreatedCount} commandes simulées.`);

  // ==========================================
  // ÉTAPE 6 : Seeding des Notifications
  // ==========================================
  console.log('6. Génération des notifications administrateur...');
  
  const notificationMessages = [
    "Nouvelle commande #MCF-B439A1 en attente de traitement.",
    "Alerte : Stock faible (inférieur à 10) pour 'Vitamine C 1000mg' à la Pharmacie de la Poste.",
    "Paiement électronique confirmé pour la commande #MCF-F5B2E8 via Moov Money.",
    "Alerte : 'Baguette Traditionnelle' en rupture de stock imminente chez l'Épi d'Or.",
    "Nouvelle commande #MCF-7E8B1C reçue de Marie Mba à Prix Import Oloumi.",
    "Nouvelle commande #MCF-2E9C5A en attente de validation à Géant Casino.",
    "Stock critique détecté pour 'Eau Minérale 1.5L' au supermarché Mbolo.",
    "Nouvelle commande #MCF-3C5E92 de Paul Obiang à la Pharmacie d'Oloumi.",
    "La commande #MCF-8F9D5E a été annulée par l'acheteur.",
    "Le magasin 'Boutique de Lalala' sollicite une mise à jour d'informations."
  ];

  for (let i = 0; i < notificationMessages.length; i++) {
    await prisma.notification.create({
      data: {
        type: i % 2 === 0 ? 'ORDER' : 'STOCK',
        message: notificationMessages[i],
        reference: `ref-notif-${i}-${Math.floor(100 + Math.random() * 900)}`,
        isRead: i > 7, // Les 2 dernières sont déjà lues
      },
    });
  }

  console.log('Notifications créées : 10 notifications administratives.');
  console.log('--- SEEDING TERMINE AVEC SUCCES ---');
}

main()
  .catch((e) => {
    console.error('Erreur durant le seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
