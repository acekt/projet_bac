import React, { Suspense } from 'react';
import Image from 'next/image';
import { StoreCard } from '@/components/ui/StoreCard';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Truck, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { PageWrapper } from '@/components/common/PageWrapper';
import { StoreSkeleton } from '@/components/common/Skeletons';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

async function StoreList() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
      },
      take: 6,
    });

    if (stores.length === 0) {
      return (
        <div className="col-span-full p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-400">Aucun magasin disponible pour le moment</h3>
          <p className="text-slate-400 max-w-md mx-auto">Revenez très bientôt pour découvrir nos partenaires.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            id={store.id}
            name={store.name}
            image={store.logo || ''}
            location={store.address}
            rating={4.8}
            deliveryTime="25-40 min"
            categories={['Alimentation', 'Hygiène', 'Bébé']}
          />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="col-span-full p-12 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-center space-y-4">
        <h3 className="text-xl font-bold text-red-600">Connexion interrompue</h3>
        <p className="text-red-500 max-w-md mx-auto">Veuillez vérifier votre connexion à la base de données.</p>
      </div>
    );
  }
}

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageWrapper>
        <main className="flex-grow">
          {/* Modern Hero Section */}
          <section className="relative min-h-[85vh] flex items-center pt-20 pb-32 overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent rounded-full text-brand-primary font-bold text-sm">
                  <Star size={16} fill="currentColor" />
                  <span>N°1 de la livraison à Libreville</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
                  Vos courses <br />
                  <span className="text-brand-primary">en un clic.</span>
                </h1>

                <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                  Plus besoin de vous déplacer. Retrouvez vos produits habituels de <span className="font-bold text-slate-800">Mbolo</span>, <span className="font-bold text-slate-800">Géant Casino</span> et <span className="font-bold text-slate-800">Prix Import</span> livrés chez vous en un temps record.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/search">
                    <Button size="lg" className="h-16 px-10 text-lg shadow-2xl shadow-brand-primary/30 rounded-2xl w-full sm:w-auto">
                      Commander maintenant
                    </Button>
                  </Link>
                  <Link href="#magasins">
                    <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl w-full sm:w-auto bg-white">
                      Explorer les magasins
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={40} height={40} />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    <span className="text-slate-900 font-bold">+10,000 clients</span> satisfaits à Libreville
                  </p>
                </div>
              </div>

              <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative z-10 rounded-[3rem] overflow-hidden border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                   <Image
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                    alt="Shopping Experience"
                    width={1000}
                    height={1200}
                    priority
                    className="object-cover h-[700px]"
                  />
                </div>
                {/* Floating UI Elements */}
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl z-20 animate-bounce-slow">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Livraison en cours</p>
                        <p className="text-sm font-black text-slate-800">Arrivée dans 12 min</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner Highlights */}
          <section className="bg-slate-50 py-24 border-y border-slate-100">
            <div className="container mx-auto px-4">
              <p className="text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-12">Ils nous font confiance</p>
              <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale opacity-50">
                 <span className="text-3xl font-black text-slate-800 tracking-tighter">MBOLO</span>
                 <span className="text-3xl font-black text-slate-800 tracking-tighter italic">GEANT Casino</span>
                 <span className="text-3xl font-black text-slate-800 tracking-tighter">PRIX IMPORT</span>
                 <span className="text-3xl font-black text-slate-800 tracking-tighter">SAN GEL</span>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-32 container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl font-black text-slate-900">Pourquoi nous choisir ?</h2>
               <p className="text-slate-500">Une expérience pensée pour vous simplifier la vie au quotidien.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'Ultra Rapide', desc: 'Livraison en moins de 45 minutes partout dans Libreville.', color: 'bg-yellow-50 text-yellow-600' },
                { icon: ShieldCheck, title: '100% Sécurisé', desc: 'Payez par Airtel Money, Moov Money ou à la livraison en toute confiance.', color: 'bg-blue-50 text-blue-600' },
                { icon: ShoppingBag, title: 'Prix Magasins', desc: 'Nous garantissons les mêmes prix qu’en rayon, sans aucune marge cachée.', color: 'bg-green-50 text-green-600' },
              ].map((feature, i) => (
                <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stores Section */}
          <section id="magasins" className="py-32 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Nos Magasins Partenaires</h2>
                  <p className="text-xl text-slate-500">Faites vos courses dans les enseignes les plus renommées.</p>
                </div>
                <Link href="/search">
                  <Button variant="ghost" className="text-brand-primary font-bold hover:bg-brand-accent h-14 px-8 rounded-xl flex items-center gap-2">
                    Voir tout <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>

              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3].map(i => <StoreSkeleton key={i} />)}
                </div>
              }>
                <StoreList />
              </Suspense>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 pb-32">
             <div className="bg-brand-secondary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center space-y-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <h2 className="text-4xl lg:text-6xl font-black text-white relative z-10 leading-tight">
                  Prêt à gagner du temps <br /> dès aujourd&apos;hui ?
                </h2>
                <div className="relative z-10">
                  <Link href="/auth/register">
                    <Button size="lg" className="h-20 px-16 text-xl rounded-2xl bg-brand-primary hover:bg-brand-primary/90 shadow-2xl shadow-brand-primary/40 border-none transition-transform hover:scale-105 active:scale-95">
                      Rejoindre l&apos;aventure
                    </Button>
                  </Link>
                </div>
             </div>
          </section>
        </main>
      </PageWrapper>

      <Footer />
    </div>
  );
}
