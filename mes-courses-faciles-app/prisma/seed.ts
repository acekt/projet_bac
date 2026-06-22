import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

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
    { name: 'Christ APINDA', email: 'admin@mcf.com', password: adminHashedPassword, role: Role.ADMIN, phone: '+241066000000' },
    { name: 'Jules Nguema', email: 'jules@mcf.com', password: hashedPassword, role: Role.ADMIN, phone: '+241066112233' },
    { name: 'Sarah Bongo', email: 'sarah@mcf.com', password: hashedPassword, role: Role.ADMIN, phone: '+241077112233' }
  ];

  for (const admin of adminsData) {
    await prisma.user.create({ data: admin });
  }
  console.log('✓ 3 Administrateurs insérés.');

  // Génération de 15 Clients Réalistes
  const clientsData = [
    // Emma (Compte test requis obligatoirement)
    { name: 'Emma', email: 'client@mcf.com', password: clientHashedPassword, role: Role.CLIENT, phone: '+241066554433', address: 'Libreville, Louis' },
    
    // Autres clients
    { name: 'Marie Mba', email: 'marie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077112244', address: 'Libreville, Glass' },
    { name: 'Paul Obiang', email: 'paul@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077223355', address: 'Libreville, Nzeng-Ayong' },
    { name: 'Jean-Pierre Ndong', email: 'jean-pierre@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077334466', address: 'Libreville, Oloumi' },
    { name: 'Christian Nguema', email: 'christian@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066778899', address: 'Libreville, Angondjé' },
    { name: 'Sophie Bongo', email: 'sophie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066889900', address: 'Libreville, Akébé' },
    { name: 'Marc Koumba', email: 'marc@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066223344', address: 'Libreville, Charbonnages' },
    { name: 'Sylvie Mombo', email: 'sylvie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066334455', address: 'Libreville, Louis' },
    { name: 'Alain Moussavou', email: 'alain@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066445566', address: 'Libreville, Oloumi' },
    { name: 'Patricia Makaya', email: 'patricia@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077445577', address: 'Libreville, Lalala' },
    { name: 'Charles Boulingui', email: 'charles@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077556688', address: 'Libreville, Glass' },
    { name: 'Florence Kombila', email: 'florence@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077667799', address: 'Libreville, Nzeng-Ayong' },
    { name: 'Eric Bekale', email: 'eric@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066998877', address: 'Libreville, Angondjé' },
    { name: 'Valerie Angoue', email: 'valerie@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241066887766', address: 'Libreville, Akébé' },
    { name: 'Sandrine Ntsame', email: 'sandrine@mcf.com', password: hashedPassword, role: Role.CLIENT, phone: '+241077889911', address: 'Libreville, Charbonnages' }
  ];

  const createdClients = [];
  let emmaUser: any = null;

  for (const clientData of clientsData) {
    const user = await prisma.user.create({ data: clientData });
    createdClients.push(user);
    if (user.email === 'client@mcf.com') {
      emmaUser = user;
    }
  }
  console.log(`✓ ${createdClients.length} Clients insérés (dont Emma).`);

  console.log('3. Génération des magasins partenaires (10 magasins)...');

  const storeDefinitions = [
    { name: 'Mbolo Supermarché', address: 'Boulevard Triomphal, Libreville', district: 'Mbolo', phone: '+24111740001', logo: config.stores['Mbolo Supermarché']?.url || '/images/store-placeholder.svg', description: 'Le plus grand supermarché historique de Libreville. Alimentation générale, fruits et légumes.', isActive: true, isDeleted: false, category: 'Alimentation' },
    { name: 'Géant Casino', address: 'Avenue de Cointet, Libreville', district: 'Glass', phone: '+24111760002', logo: config.stores['Géant Casino']?.url || '/images/store-placeholder.svg', description: 'Produits frais, épicerie fine et importations de qualité supérieure.', isActive: true, isDeleted: false, category: 'Alimentation' },
    { name: 'TiDB Tech Store', address: 'Zone Industrielle Oloumi, Libreville', district: 'Oloumi', phone: '+24111720022', logo: config.stores['TiDB Tech Store']?.url || '/images/store-placeholder.svg', description: 'Ordinateurs, téléphones, accessoires informatiques et composants high-tech.', isActive: true, isDeleted: false, category: 'Électronique' },
    { name: 'Gaza Électroménager', address: 'Avenue de Cointet, Libreville', district: 'Glass', phone: '+24111760021', logo: config.stores['Gaza Électroménager']?.url || '/images/store-placeholder.svg', description: 'Le spécialiste de l\'électroménager et des Smart TV de Libreville.', isActive: true, isDeleted: false, category: 'Électronique' },
    { name: 'Boutique Bio-Glow', address: 'Carrefour Angondjé, Libreville', district: 'Angondjé', phone: '+24111700024', logo: config.stores['Boutique Bio-Glow']?.url || '/images/store-placeholder.svg', description: 'Savons bio locaux, soins capillaires, huiles végétales et bien-être.', isActive: true, isDeleted: false, category: 'Beauté' },
    { name: 'Or & Parfums', address: 'Carrefour Louis, Libreville', district: 'Louis', phone: '+24111780023', logo: config.stores['Or & Parfums']?.url || '/images/store-placeholder.svg', description: 'Gamme complète de parfums importés authentiques et maquillage de marque.', isActive: true, isDeleted: false, category: 'Beauté' },
    { name: 'Shoes & Style', address: 'Avenue des Mines, Libreville', district: 'Oloumi', phone: '+24111750026', logo: config.stores['Shoes & Style']?.url || '/images/store-placeholder.svg', description: 'Chaussures de créateurs, sacs à main, ceintures et maroquinerie fine.', isActive: true, isDeleted: false, category: 'Mode' },
    { name: 'Gabon Chic & Mode', address: 'Centre-ville, Libreville', district: 'Centre-ville', phone: '+24111710025', logo: config.stores['Gabon Chic & Mode']?.url || '/images/store-placeholder.svg', description: 'Prêt-à-porter, chemises, costumes et vêtements stylés pour tous.', isActive: true, isDeleted: false, category: 'Mode' },
    { name: 'Libreville Ameublement', address: 'Rond-point des Charbonnages, Libreville', district: 'Charbonnages', phone: '+24111730027', logo: config.stores['Libreville Ameublement']?.url || '/images/store-placeholder.svg', description: 'Meubles design, canapés confortables et agencement de salon.', isActive: true, isDeleted: false, category: 'Maison' },
    { name: 'Brico-Déco Gabon', address: 'Carrefour Akébé, Libreville', district: 'Akébé', phone: '+24111790028', logo: config.stores['Brico-Déco Gabon']?.url || '/images/store-placeholder.svg', description: 'Outils de bricolage, rideaux, décoration murale et petits accessoires maison.', isActive: true, isDeleted: false, category: 'Maison' }
  ];

  const createdStores = [];
  for (const sDef of storeDefinitions) {
    const { category, ...storeData } = sDef;
    const store = await prisma.store.create({ data: storeData });
    createdStores.push({ ...store, category });
  }
  console.log(`✓ ${createdStores.length} Magasins insérés dans 5 catégories distinctes.`);

  // ========================================================
  // ÉTAPE 4 : Seeding du Catalogue Produits (Product)
  // ========================================================
  console.log('4. Génération du catalogue produits (15 à 20 produits par magasin)...');
  
  const allProducts: any[] = [];

  const productTemplates: Record<string, { name: string; description: string; basePrice: number; unit: string }[]> = {
    'Alimentation': [
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
      { name: 'Jus d\'Orange Pur 1L', description: 'Jus de fruits fraîchement pressés, sans sucres ajoutés.', basePrice: 1300, unit: 'brique' },
      { name: 'Eau Minérale Locale 1.5L', description: 'Eau de source naturelle purifiée en bouteille.', basePrice: 400, unit: 'bouteille' },
      { name: 'Chips Artisanales Salées', description: 'Chips de pommes de terre croustillantes salées.', basePrice: 1100, unit: 'paquet' },
      { name: 'Chocolat Noir 70% 100g', description: 'Tablette de chocolat noir intense d\'Afrique équatoriale.', basePrice: 1200, unit: 'tablette' },
      { name: 'Sardines Pimentées (boîte)', description: 'Sardines entières à l\'huile avec une pointe de piment.', basePrice: 750, unit: 'boîte' },
      { name: 'Poulet Surgelé Entier 1.3kg', description: 'Poulet prêt à cuire élevé en plein air.', basePrice: 3500, unit: 'pièce' },
      { name: 'Œufs Frais du Gabon (x30)', description: 'Plateau de 30 œufs de ferme calibre moyen.', basePrice: 3200, unit: 'plateau' },
      { name: 'Sel Fin de Table 1kg', description: 'Sel marin fin enrichi en iode pour la cuisine.', basePrice: 350, unit: 'paquet' },
      { name: 'Biscuits Sablés Beurre', description: 'Sablés traditionnels fondants et croustillants.', basePrice: 950, unit: 'paquet' },
      { name: 'Yaourts aux Fruits (x4)', description: 'Assortiment de 4 yaourts crémeux aux fruits.', basePrice: 1400, unit: 'pack' }
    ],
    'Électronique': [
      { name: 'Smart TV LED 43" 4K', description: 'Téléviseur connecté avec résolution UHD et HDR intégrée.', basePrice: 189000, unit: 'pièce' },
      { name: 'Smartphone Pro 128Go', description: 'Double SIM, appareil photo 48MP, grand écran fluide.', basePrice: 135000, unit: 'pièce' },
      { name: 'Écouteurs Sans Fil Pro', description: 'Son stéréo HD, réduction de bruit passive et micro intégré.', basePrice: 22000, unit: 'paire' },
      { name: 'Enceinte Bluetooth Étanche', description: 'Son puissant, autonomie 12h, résistance aux éclaboussures.', basePrice: 38000, unit: 'pièce' },
      { name: 'Batterie Externe 20k mAh', description: 'Powerbank haute capacité avec affichage LED de charge.', basePrice: 19000, unit: 'pièce' },
      { name: 'Souris Optique Sans Fil', description: 'Forme ergonomique, récepteur USB ultra-compact.', basePrice: 9500, unit: 'pièce' },
      { name: 'Clavier Gaming Rétroéclairé', description: 'Clavier à membrane robuste avec lumières LED RGB.', basePrice: 24000, unit: 'pièce' },
      { name: 'Chargeur Mural 20W Rapide', description: 'Bloc de charge rapide double port USB-A et USB-C.', basePrice: 12000, unit: 'pièce' },
      { name: 'Câble USB-C Tressé 2m', description: 'Câble haute résistance pour transfert rapide et recharge.', basePrice: 4500, unit: 'pièce' },
      { name: 'Clé USB 3.0 de 64Go', description: 'Transferts rapides pour tous vos fichiers importants.', basePrice: 8500, unit: 'pièce' },
      { name: 'Blender Mixeur Pro 1.5L', description: 'Blender puissant avec bol en verre gradué résistant.', basePrice: 29500, unit: 'pièce' },
      { name: 'Bouilloire Électrique Inox', description: 'Capacité 1.8L avec chauffe rapide et arrêt automatique.', basePrice: 15000, unit: 'pièce' },
      { name: 'Machine à Café Filtre', description: 'Cafetière 10-12 tasses avec système anti-gouttes.', basePrice: 26000, unit: 'pièce' },
      { name: 'Fer à Repasser Vapeur', description: 'Semelle antiadhésive, réservoir d\'eau 300ml.', basePrice: 18000, unit: 'pièce' },
      { name: 'Ventilateur Sur Pied Oscillant', description: 'Hauteur réglable, 3 vitesses avec grille de protection.', basePrice: 27000, unit: 'pièce' },
      { name: 'Casque Audio Stéréo', description: 'Casque filaire avec arceau rembourré et basses profondes.', basePrice: 16500, unit: 'pièce' }
    ],
    'Beauté': [
      { name: 'Rouge à Lèvres Rouge Velours', description: 'Fini mat intense, texture crémeuse longue tenue.', basePrice: 7500, unit: 'pièce' },
      { name: 'Crème Hydratante Visage 50ml', description: 'Soin hydratant protecteur quotidien, texture légère.', basePrice: 11500, unit: 'pot' },
      { name: 'Huile de Coco Vierge 250ml', description: 'Huile de coco pure pour soins capillaires et corporels.', basePrice: 4800, unit: 'flacon' },
      { name: 'Shampoing Doux Aloe Vera', description: 'Nourrit et apporte brillance aux cheveux normaux.', basePrice: 3800, unit: 'flacon' },
      { name: 'Gel Douche Hydratant 400ml', description: 'Parfum frais et vivifiant pour un réveil énergique.', basePrice: 2900, unit: 'flacon' },
      { name: 'Masque Purifiant Argile', description: 'Masque visage pour désincruster les pores et purifier.', basePrice: 6500, unit: 'tube' },
      { name: 'Parfum Patchouli & Vanille', description: 'Eau de parfum sensuelle avec notes épicées.', basePrice: 39500, unit: 'bouteille' },
      { name: 'Vernis à Ongles Brillant', description: 'Vernis longue tenue couleur nude élégante.', basePrice: 2500, unit: 'flacon' },
      { name: 'Lait Corporel Karité 250ml', description: 'Nourrit intensément les peaux sèches et déshydratées.', basePrice: 5500, unit: 'flacon' },
      { name: 'Crème Mains Réparatrice', description: 'Soin concentré pour mains sèches et abîmées.', basePrice: 3200, unit: 'tube' },
      { name: 'Eyeliner Noir Précision', description: 'Feutre traceur noir mat résistant à l\'eau.', basePrice: 5800, unit: 'pièce' },
      { name: 'Mascara Volume Intense', description: 'Brosse volumatrice pour des cils allongés et denses.', basePrice: 8500, unit: 'pièce' },
      { name: 'Gommage Corps Sucre & Café', description: 'Exfoliant naturel pour une peau lisse et satinée.', basePrice: 7900, unit: 'pot' },
      { name: 'Palette d\'Ombres à Paupières', description: 'Palette de 10 fards aux teintes chaudes et dorées.', basePrice: 15000, unit: 'boîte' },
      { name: 'Crème Solaire Visage SPF50', description: 'Haute protection UV non grasse pour le visage.', basePrice: 9800, unit: 'tube' }
    ],
    'Mode': [
      { name: 'Jean Coupe Droite Denim', description: 'Jean classique en coton épais confortable.', basePrice: 19500, unit: 'pièce' },
      { name: 'T-Shirt Blanc Coton Bio', description: 'Coupe classique, col rond, coton très doux.', basePrice: 5500, unit: 'pièce' },
      { name: 'Chemise en Lin Cintrée', description: 'Chemise légère et élégante, couleur beige naturel.', basePrice: 18000, unit: 'pièce' },
      { name: 'Robe d\'Été Imprimée', description: 'Robe fluide à fleurs avec bretelles ajustables.', basePrice: 23000, unit: 'pièce' },
      { name: 'Baskets Sportives Homme', description: 'Baskets respirantes avec semelle amortissante.', basePrice: 35000, unit: 'paire' },
      { name: 'Chaussures Cuir Classiques', description: 'Chaussures habillées noires, confortables.', basePrice: 49000, unit: 'paire' },
      { name: 'Veste Légère Casual', description: 'Veste mi-saison en toile de coton avec poches.', basePrice: 28000, unit: 'pièce' },
      { name: 'Sac Bandoulière Cuir', description: 'Petit sac élégant avec bandoulière réglable.', basePrice: 27000, unit: 'pièce' },
      { name: 'Lunettes de Soleil UV400', description: 'Style vintage avec verres polarisés protecteurs.', basePrice: 11500, unit: 'pièce' },
      { name: 'Ceinture Noire en Cuir', description: 'Ceinture classique en cuir véritable avec boucle métal.', basePrice: 7000, unit: 'pièce' },
      { name: 'Short Chino Classique', description: 'Short en coton stretch confortable pour l\'été.', basePrice: 13500, unit: 'pièce' },
      { name: 'Polo Homme Sport Chic', description: 'Polo en piqué de coton, col boutonné classique.', basePrice: 11000, unit: 'pièce' },
      { name: 'Chapeau de Paille Élégant', description: 'Chapeau respirant idéal pour le soleil tropical.', basePrice: 6500, unit: 'pièce' },
      { name: 'Lot de 3 Chaussettes Coton', description: 'Chaussettes de sport confortables anti-frottements.', basePrice: 4200, unit: 'lot' },
      { name: 'Sweat à Capuche Molletonné', description: 'Sweat chaud et confortable, coloris gris chiné.', basePrice: 19000, unit: 'pièce' }
    ],
    'Maison': [
      { name: 'Lampe de Chevet Design', description: 'Pied en bois clair et abat-jour blanc épuré.', basePrice: 16500, unit: 'pièce' },
      { name: 'Coussin Velours Décoratif', description: 'Coussin moelleux pour canapé ou lit (45x45 cm).', basePrice: 5800, unit: 'pièce' },
      { name: 'Tapis de Salon Graphique', description: 'Tapis tissé à motifs scandinaves noirs et blancs.', basePrice: 59000, unit: 'pièce' },
      { name: 'Horloge Murale Vintage', description: 'Grande horloge silencieuse en métal et bois.', basePrice: 14500, unit: 'pièce' },
      { name: 'Table Basse Design', description: 'Table avec double plateau bois et pieds en épingle.', basePrice: 69000, unit: 'pièce' },
      { name: 'Miroir Rond Cadre Métal', description: 'Miroir mural décoratif diamètre 50cm coloris laiton.', basePrice: 22000, unit: 'pièce' },
      { name: 'Plante Artificielle Verte', description: 'Faux monstera en pot plastique noir réaliste.', basePrice: 13500, unit: 'pièce' },
      { name: 'Bougie Parfumée Lavande', description: 'Cire végétale naturelle parfumée aux huiles essentielles.', basePrice: 4900, unit: 'pièce' },
      { name: 'Housse de Couette Coton', description: 'Parure de lit double 240x220 cm avec 2 taies.', basePrice: 28000, unit: 'set' },
      { name: 'Paire de Rideaux Occultants', description: 'Rideaux isolants bloquant la lumière du soleil.', basePrice: 24500, unit: 'paire' },
      { name: 'Vase en Céramique Blanche', description: 'Vase moderne au design géométrique pour fleurs.', basePrice: 9500, unit: 'pièce' },
      { name: 'Poubelle Inox à Pédale 30L', description: 'Finition mate anti-traces, fermeture silencieuse.', basePrice: 21000, unit: 'pièce' },
      { name: 'Organisateur de Tiroirs (x4)', description: 'Ensemble de compartiments de rangement pliables.', basePrice: 7500, unit: 'lot' },
      { name: 'Cadre Photo Bois Exotique', description: 'Cadre mural ou à poser format 15x20 cm.', basePrice: 4500, unit: 'pièce' },
      { name: 'Diffuseur de Parfum Rotin', description: 'Flacon diffuseur d\'ambiance aux tiges de rotin.', basePrice: 8500, unit: 'pièce' }
    ]
  };

  const productsToCreate: any[] = [];

  for (const store of createdStores) {
    const templates = productTemplates[store.category] || productTemplates['Alimentation'];
    
    for (const temp of templates) {
      // Variation de prix (+/- 12%)
      const priceVariation = 0.88 + Math.random() * 0.24;
      const finalPrice = Math.round((temp.basePrice * priceVariation) / 50) * 50; // arrondi à 50 FCFA
      
      // Stock : 15% de chance de rupture de stock (0), sinon entre 10 et 200 unités
      const isOutOfStock = Math.random() < 0.15;
      const stock = isOutOfStock ? 0 : Math.floor(10 + Math.random() * 190);

      const productImg = config.products[temp.name]?.url || '/images/product-placeholder.svg';
      productsToCreate.push({
        name: temp.name,
        description: temp.description,
        price: finalPrice,
        stock: stock,
        unit: temp.unit,
        category: store.category,
        images: JSON.stringify([productImg]),
        storeId: store.id,
        isActive: true,
        isDeleted: false
      });
    }
  }

  // Insertion en masse via createMany pour optimiser les performances de TiDB
  await prisma.product.createMany({
    data: productsToCreate
  });

  // Récupération de tous les produits créés pour obtenir leurs IDs pour les commandes
  const dbProducts = await prisma.product.findMany({});
  allProducts.push(...dbProducts);

  console.log(`✓ ${allProducts.length} Produits insérés dans le catalogue (15 à 20 par boutique).`);

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

  let totalOrdersCreated = 0;

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
    const orderItemsData = emmaActiveItems.map(item => {
      itemsTotal += item.product.price * item.qty;
      return {
        productId: item.product.id,
        quantity: item.qty,
        price: item.product.price
      };
    });

    const activeOrderDate = new Date(); // aujourd'hui
    await prisma.order.create({
      data: {
        userId: emmaUser.id,
        storeId: mboloStore.id,
        total: itemsTotal + deliveryFee,
        deliveryFee,
        status: OrderStatus.PAID,
        paymentMethod: 'airtel',
        deliveryAddress: 'Emma - +241066554433 - Libreville, quartier Louis, Villa MCF',
        createdAt: activeOrderDate,
        updatedAt: activeOrderDate,
        orderItems: {
          create: orderItemsData
        }
      }
    });
    totalOrdersCreated++;

    // B. Trois commandes passées (DELIVERED) plus anciennes pour l'onglet historique du profil
    for (let k = 0; k < 3; k++) {
      const randomStoreId = activeStoreIds[k % activeStoreIds.length];
      const storeProducts = storeProductsMap.get(randomStoreId)!;
      const product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
      
      const qty = Math.floor(Math.random() * 2) + 1;
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - (5 + k * 8)); // il y a 5, 13 et 21 jours

      await prisma.order.create({
        data: {
          userId: emmaUser.id,
          storeId: randomStoreId,
          total: (product.price * qty) + deliveryFee,
          deliveryFee,
          status: OrderStatus.DELIVERED,
          paymentMethod: paymentMethods[k % paymentMethods.length],
          deliveryAddress: 'Emma - +241066554433 - Libreville, quartier Louis, Villa MCF',
          createdAt: orderDate,
          updatedAt: orderDate,
          orderItems: {
            create: [
              {
                productId: product.id,
                quantity: qty,
                price: product.price
              }
            ]
          }
        }
      });
      totalOrdersCreated++;
    }
    console.log('✓ Commandes tests d\'Emma générées.');
  }

  // 2. Commandes Aléatoires Restantes pour atteindre au moins 50 commandes totales
  const ordersNeeded = 50 - totalOrdersCreated;
  console.log(`Génération des ${ordersNeeded} autres commandes aléatoires...`);

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
    const orderItemsData = selectedProducts.map(p => {
      const qty = Math.floor(Math.random() * 2) + 1;
      itemsTotal += p.price * qty;
      return {
        productId: p.id,
        quantity: qty,
        price: p.price
      };
    });

    // Random status
    const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    // Random date over the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);

    await prisma.order.create({
      data: {
        userId: client.id,
        storeId,
        total: itemsTotal + deliveryFee,
        deliveryFee,
        status,
        paymentMethod,
        deliveryAddress: `${client.name} - ${client.phone} - ${client.address || 'Libreville, Gabon'}`,
        createdAt: orderDate,
        updatedAt: orderDate,
        orderItems: {
          create: orderItemsData
        }
      }
    });
    totalOrdersCreated++;
  }

  console.log(`✓ ${totalOrdersCreated} Commandes simulées au total.`);

  // ========================================================
  // ÉTAPE 6 : Seeding des Notifications Administrateur
  // ========================================================
  console.log('6. Génération des notifications d\'administration...');
  
  const notificationAlerts = [
    { type: 'ORDER', message: 'Nouvelle commande reçue chez Mbolo Supermarché.', reference: 'notif-order-mbolo-1' },
    { type: 'STOCK', message: 'Alerte : Stock faible pour "Smart TV LED 43" 4K" chez Gaza Électroménager.', reference: 'notif-stock-gaza-1' },
    { type: 'ORDER', message: 'Nouvelle commande payée en attente chez Boutique Bio-Glow.', reference: 'notif-order-bio-1' },
    { type: 'STOCK', message: 'Rupture de stock signalée pour "Crème Visage 50ml" chez Or & Parfums.', reference: 'notif-stock-or-1' },
    { type: 'ORDER', message: 'Commande annulée par l\'acheteur Paul Obiang.', reference: 'notif-order-cancel-1' }
  ];

  for (const alert of notificationAlerts) {
    await prisma.notification.create({
      data: {
        type: alert.type,
        message: alert.message,
        reference: alert.reference,
        isRead: false
      }
    });
  }

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
