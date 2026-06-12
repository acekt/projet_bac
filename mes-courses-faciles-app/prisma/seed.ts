import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin12345', 10);
  const clientPassword = await bcrypt.hash('Client12345', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Jules',
      email: 'admin@mcf.com',
      password: adminPassword,
      phone: '+24107000000',
      role: 'ADMIN',
    },
  });

  const client = await prisma.user.create({
    data: {
      name: 'Jean Dupont',
      email: 'client@mcf.com',
      password: clientPassword,
      phone: '+24106000000',
      role: 'CLIENT',
      address: 'Libreville, Glass',
    },
  });

  console.log('Created Users:', { admin: admin.email, client: client.email });

  // Create Stores
  const storeMbolo = await prisma.store.create({
    data: {
      id: 'mbolo',
      name: 'Mbolo Supermarché',
      address: 'Boulevard Triomphal, Libreville',
      district: 'Mbolo',
      phone: '+24111740000',
      logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200&auto=format&fit=crop',
      description: 'Le plus grand supermarché historique de Libreville.',
      isActive: true,
    },
  });

  const storeCasino = await prisma.store.create({
    data: {
      id: 'geant-casino',
      name: 'Géant Casino',
      address: 'Avenue de Cointet, Libreville',
      district: 'Glass',
      phone: '+24111760000',
      logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=200&auto=format&fit=crop',
      description: 'Produits importés et locaux de qualité supérieure.',
      isActive: true,
    },
  });

  const storePrixImport = await prisma.store.create({
    data: {
      id: 'prix-import',
      name: 'Prix Import',
      address: 'Zone Industrielle d\'Oloumi, Libreville',
      district: 'Oloumi',
      phone: '+24111720000',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
      description: 'Vos courses au meilleur prix de gros et détail.',
      isActive: true,
    },
  });

  console.log('Created Stores:', [storeMbolo.name, storeCasino.name, storePrixImport.name]);

  // Create Products for Mbolo
  await prisma.product.createMany({
    data: [
      {
        name: 'Riz Long Grain 5kg',
        description: 'Riz blanc long grain de qualité supérieure.',
        price: 4500,
        category: 'Alimentaire',
        stock: 150,
        unit: 'sac',
        images: JSON.stringify(['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop']),
        storeId: storeMbolo.id,
      },
      {
        name: 'Lait Demi-Écrémé 1L',
        description: 'Lait de vache UHT demi-écrémé.',
        price: 850,
        category: 'Alimentaire',
        stock: 500,
        unit: 'brique',
        images: JSON.stringify(['https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400']),
        storeId: storeMbolo.id,
      },
      {
        name: 'Huile de Tournesol 1L',
        description: 'Huile végétale pure pour cuisson et friture.',
        price: 1200,
        category: 'Alimentaire',
        stock: 200,
        unit: 'bouteille',
        images: JSON.stringify(['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400']),
        storeId: storeMbolo.id,
      },
      {
        name: 'Eau Minérale MCF 1.5L',
        description: 'Eau minérale naturelle locale.',
        price: 400,
        category: 'Boissons',
        stock: 1000,
        unit: 'bouteille',
        images: JSON.stringify(['https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=400']),
        storeId: storeMbolo.id,
      },
    ],
  });

  // Create Products for Casino
  await prisma.product.createMany({
    data: [
      {
        name: 'Café Arabica Moulu 250g',
        description: 'Café torréfié et moulu 100% Arabica.',
        price: 2400,
        category: 'Alimentaire',
        stock: 80,
        unit: 'paquet',
        images: JSON.stringify(['https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400']),
        storeId: storeCasino.id,
      },
      {
        name: 'Chocolat Noir 70% 100g',
        description: 'Tablette de chocolat noir de dégustation.',
        price: 1500,
        category: 'Alimentaire',
        stock: 120,
        unit: 'tablette',
        images: JSON.stringify(['https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=400']),
        storeId: storeCasino.id,
      },
      {
        name: 'Savon Liquide Hygiène 500ml',
        description: 'Savon liquide pour les mains hydratant.',
        price: 1800,
        category: 'Hygiène',
        stock: 150,
        unit: 'flacon',
        images: JSON.stringify(['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=400&auto=format&fit=crop']),
        storeId: storeCasino.id,
      },
    ],
  });

  // Create Products for Prix Import
  await prisma.product.createMany({
    data: [
      {
        name: 'Lessive Poudre 2kg',
        description: 'Lessive en poudre parfumée pour machine.',
        price: 3500,
        category: 'Nettoyage',
        stock: 100,
        unit: 'paquet',
        images: JSON.stringify(['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=400']),
        storeId: storePrixImport.id,
      },
      {
        name: 'Jus d\'Orange 1L',
        description: 'Jus d\'orange 100% pur jus sans sucres ajoutés.',
        price: 1100,
        category: 'Boissons',
        stock: 300,
        unit: 'brique',
        images: JSON.stringify(['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop']),
        storeId: storePrixImport.id,
      },
    ],
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
