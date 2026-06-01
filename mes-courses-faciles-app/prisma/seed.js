const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // Nettoyage de la base de données dans l'ordre des dépendances
  console.log('Nettoyage des tables existantes...');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  // Création des utilisateurs par défaut
  console.log('Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const clientUser = await prisma.user.create({
    data: {
      name: 'Jean Dupont',
      email: 'client@example.com',
      password: hashedPassword,
      phone: '+24107000000',
      address: 'Angondjé, Libreville',
      role: 'CLIENT',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin MCF',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '+24106000000',
      address: 'Louis, Libreville',
      role: 'ADMIN',
    },
  });

  console.log(`Utilisateurs créés: ${clientUser.email} (CLIENT), ${adminUser.email} (ADMIN)`);

  // Création des magasins
  console.log('Création des magasins...');
  const stores = [
    {
      id: 'mbolo',
      name: 'Mbolo',
      address: 'Bvd Triomphal, Libreville',
      district: 'Bvd Triomphal',
      phone: '+241 01 76 00 00',
      logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop',
      description: 'Le plus grand hypermarché du Gabon avec tous vos produits du quotidien.',
      isActive: true,
    },
    {
      id: 'geant-casino',
      name: 'Géant Casino',
      address: 'Camp de Gaulle, Libreville',
      district: 'Camp de Gaulle',
      phone: '+241 01 74 00 00',
      logo: 'https://images.unsplash.com/photo-1604719312563-861ac03ef4d2?q=80&w=800&auto=format&fit=crop',
      description: 'Votre supermarché de confiance avec un large choix de produits importés.',
      isActive: true,
    },
    {
      id: 'prix-import',
      name: 'Prix Import',
      address: 'Olumi, Libreville',
      district: 'Olumi',
      phone: '+241 01 72 00 00',
      logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop',
      description: "Grossiste et demi-grossiste offrant les meilleurs tarifs sur l'alimentation et l'hygiène.",
      isActive: true,
    },
    {
      id: 'supergros',
      name: 'Supergros',
      address: 'Owendo, Libreville',
      district: 'Owendo',
      phone: '+241 01 70 00 00',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
      description: 'Spécialiste du gros alimentaire et boissons pour particuliers et professionnels.',
      isActive: true,
    },
  ];

  for (const store of stores) {
    await prisma.store.create({ data: store });
  }
  console.log(`${stores.length} magasins partenaires créés.`);

  // Produits types à insérer pour chaque magasin
  const productTemplates = [
    {
      name: 'Riz Long Grain 5kg',
      description: 'Riz blanc long grain de qualité supérieure, idéal pour tous vos plats de riz cantonais ou sauce.',
      price: 4500,
      category: 'Alimentaire',
      unit: 'sac',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Huile de Tournesol 1L',
      description: 'Huile de tournesol 100% pure, idéale pour la cuisson et les fritures légères.',
      price: 1200,
      category: 'Alimentaire',
      unit: 'bouteille',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbadb8c5?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Lait Entier 1L',
      description: 'Lait entier UHT de vache, riche en calcium et en vitamines.',
      price: 850,
      category: 'Alimentaire',
      unit: 'brique',
      stock: 90,
      image: 'https://images.unsplash.com/photo-1550583724-125581dc228b?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Pâtes Spaghetti 500g',
      description: 'Pâtes de blé dur de qualité supérieure, cuisson rapide en 8-10 minutes.',
      price: 600,
      category: 'Alimentaire',
      unit: 'paquet',
      stock: 250,
      image: 'https://images.unsplash.com/photo-1551462147-3a8836a9b40d?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Eau Minérale 1.5L (Pack de 6)',
      description: "Source d'eau minérale naturelle locale, pure et rafraîchissante.",
      price: 2100,
      category: 'Boissons',
      unit: 'pack',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf3d?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Savon de Toilette',
      description: 'Savon dermatologique doux pour le corps et le visage, parfum frais et naturel.',
      price: 450,
      category: 'Hygiène',
      unit: 'unité',
      stock: 400,
      image: 'https://images.unsplash.com/photo-1605264964528-06403738d6dc?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Yaourt Nature x4',
      description: 'Yaourt crémeux nature sans sucre ajouté, fabriqué à partir de lait frais.',
      price: 1400,
      category: 'Alimentaire',
      unit: 'pack',
      stock: 80,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Jus d\'Orange 1L',
      description: 'Pur jus d\'orange avec pulpe, riche en vitamine C et pressé à froid.',
      price: 1100,
      category: 'Boissons',
      unit: 'bouteille',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=400&auto=format&fit=crop',
    },
  ];

  console.log('Création des produits pour chaque magasin...');
  let totalProducts = 0;
  for (const store of stores) {
    for (const template of productTemplates) {
      // Ajustement léger du prix selon les magasins pour simuler la réalité
      let priceAdjustment = 0;
      if (store.id === 'mbolo') priceAdjustment = 100; // Un peu plus cher
      if (store.id === 'prix-import') priceAdjustment = -50; // Prix de gros
      if (store.id === 'supergros') priceAdjustment = -100; // Moins cher

      await prisma.product.create({
        data: {
          name: template.name,
          description: template.description,
          price: Math.max(100, template.price + priceAdjustment),
          category: template.category,
          unit: template.unit,
          stock: template.stock,
          images: JSON.stringify([template.image]),
          storeId: store.id,
          isActive: true,
        },
      });
      totalProducts++;
    }
  }

  console.log(`Seeding terminé avec succès ! Total de ${totalProducts} produits créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
