import React from 'react';
import Image from 'next/image';
import { StoreCard } from '@/components/ui/StoreCard';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Truck, ShieldCheck, Zap } from 'lucide-react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { PageWrapper } from '@/components/common/PageWrapper';

async function getStores() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      take: 4,
    });
    return stores;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function HomePage() {
  const stores = await getStores();
  const dbError = stores.length === 0;

  return (
    <PageWrapper>
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] lg:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
            alt="Hero background"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white space-y-6 animate-in">
            <span className="inline-block px-4 py-1.5 bg-brand-primary rounded-full text-sm font-bold tracking-wide uppercase">
              Simple • Rapide • Fiable
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
              Vos courses de <span className="text-brand-primary">Libreville</span> livrées chez vous.
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 leading-relaxed">
              Commandez dans vos magasins préférés comme Mbolo ou Géant Casino et recevez vos produits en moins d&apos;une heure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-lg h-16 sm:px-10">
                Commencer mes courses
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-brand-secondary h-16 sm:px-10">
                Voir les magasins
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          {[
            { icon: Truck, title: 'Livraison Rapide', desc: 'En moins de 60min' },
            { icon: ShieldCheck, title: 'Paiement Sécurisé', desc: 'Airtel & Moov Money' },
            { icon: Zap, title: 'Meilleurs Prix', desc: 'Identiques au magasin' },
            { icon: ShoppingBag, title: 'Large Choix', desc: '+5000 produits' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary">
                <feature.icon size={32} />
              </div>
              <h3 className="font-bold text-slate-800">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stores Section */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800">Magasins Partenaires</h2>
            <p className="text-slate-500">Choisissez votre magasin habituel pour commencer.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-2">
            Voir tous les magasins
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dbError ? (
            <div className="col-span-full p-12 bg-red-50 border-2 border-red-100 rounded-[2rem] text-center space-y-4">
              <h3 className="text-xl font-bold text-red-600">Oups ! Les magasins sont temporairement inaccessibles</h3>
              <p className="text-red-500 max-w-md mx-auto font-medium">Nous rencontrons un problème de connexion à notre base de données. Veuillez vérifier que votre serveur MySQL est bien lancé dans XAMPP.</p>
              <Link href="/">
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">Réessayer</Button>
              </Link>
            </div>
          ) : (
            stores.map((store) => (
              <StoreCard
                 key={store.id}
                 id={store.id}
                 name={store.name}
                 image={store.logo || ''}
                 location={store.address}
                 rating={4.5}
                 deliveryTime="30-45 min"
                 categories={['Alimentation', 'Hygiène']}
              />
            ))
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-brand-secondary rounded-[2rem] p-8 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 skew-x-12 translate-x-1/4" />

          <div className="relative z-10 flex-1 space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
              Gagnez du temps, <br />
              <span className="text-brand-primary">on s&apos;occupe de tout.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg">
              Téléchargez notre application mobile pour une expérience encore plus fluide et recevez des notifications en temps réel sur vos livraisons.
            </p>
            <div className="flex gap-4">
              <Image unoptimized src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" width={135} height={40} className="h-12 w-auto cursor-pointer" />
              <Image unoptimized src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" width={120} height={40} className="h-12 w-auto cursor-pointer" />
            </div>
          </div>

          <div className="relative z-10 flex-1 flex justify-center">
            <div className="relative w-64 h-[450px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-700 shadow-2xl overflow-hidden">
               <div className="absolute top-0 w-full h-6 bg-slate-700 flex justify-center z-20">
                 <div className="w-20 h-4 bg-slate-800 rounded-b-xl" />
               </div>
               <Image
                 src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
                 alt="App Preview"
                 fill
                 className="object-cover opacity-80"
               />
            </div>
          </div>
        </div>
      </section>
    </div>
    </PageWrapper>
  );
}
