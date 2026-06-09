import React, { Suspense } from 'react';
import Image from 'next/image';
import { StoreCard } from '@/components/blocks/catalog/StoreCard';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { StoreSkeleton } from '@/components/common/Skeletons';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

async function BentoStoreList() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
      },
      take: 5,
    });

    if (stores.length === 0) {
      return (
        <div className="col-span-full p-12 bg-muted border-2 border-dashed border-border rounded-3xl text-center space-y-4">
          <h3 className="text-xl font-bold text-muted-foreground">Aucun magasin partenaire</h3>
          <p className="max-w-md mx-auto">Revenez très bientôt pour découvrir nos partenaires.</p>
        </div>
      );
    }

    // Bento Grid Layout: 1 large card (takes 2 cols/rows on desktop), followed by smaller ones
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        {stores.map((store, index) => {
           const isFeatured = index === 0;
           return (
               <div key={store.id} className={isFeatured ? "md:col-span-2 md:row-span-2 h-[524px]" : "h-[250px]"}>
                  <StoreCard
                    id={store.id}
                    name={store.name}
                    image={store.logo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600&auto=format&fit=crop"}
                    location={store.address}
                    rating={4.8}
                    deliveryTime="30-45 min"
                    categories={['Alimentation', 'Hygiène']}
                  />
               </div>
           );
        })}
      </div>
    );
  } catch (error) {
    return (
      <div className="col-span-full p-12 bg-destructive/10 border-2 border-destructive/20 rounded-3xl text-center space-y-4">
        <h3 className="text-xl font-bold text-destructive">Erreur de connexion</h3>
        <p className="text-destructive max-w-md mx-auto">Impossible de charger les magasins pour le moment.</p>
      </div>
    );
  }
}

export default async function HomePage() {
  return (
    <>
      {/* Modern Hero Section (Typography & Abstraction First) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden bg-background">
        {/* Abstract Background Gradient Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply animate-pulse opacity-70" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-accent/20 blur-[150px] mix-blend-multiply opacity-60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-foreground font-semibold text-sm shadow-sm mx-auto">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              Livraison ultra-rapide à Libreville
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-foreground tracking-tight leading-[1.05]">
              Vos courses faciles <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                à Libreville.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
              Le meilleur des magasins locaux livré chez vous en toute sécurité. Payez par <strong className="text-foreground">Airtel Money</strong>, <strong className="text-foreground">Moov</strong> ou à la livraison.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
              <Link href="/search" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/25 rounded-2xl w-full hover:scale-105 transition-transform active:scale-95">
                  Commencer mes achats
                </Button>
              </Link>
              <Link href="#magasins" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl w-full bg-background/50 backdrop-blur-sm border-border hover:bg-muted">
                  Découvrir les magasins
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Stores Section */}
      <section id="magasins" className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground">Nos Partenaires</h2>
            <p className="text-xl text-muted-foreground">Une sélection des meilleurs supermarchés pour vous garantir qualité et fraîcheur.</p>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
              <div className="md:col-span-2 md:row-span-2 h-[524px]"><StoreSkeleton /></div>
              <div className="h-[250px]"><StoreSkeleton /></div>
              <div className="h-[250px]"><StoreSkeleton /></div>
              <div className="h-[250px]"><StoreSkeleton /></div>
              <div className="h-[250px]"><StoreSkeleton /></div>
            </div>
          }>
            <BentoStoreList />
          </Suspense>

          <div className="mt-16 text-center">
             <Link href="/search">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-border bg-background hover:bg-muted font-bold text-foreground group">
                   Voir tous nos magasins partenaires <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </Button>
             </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
