import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Navbar } from "@/components/layout/public/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-mesh flex flex-col overflow-x-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none z-30 opacity-[0.015]" />
      <Navbar />
      <main className="flex-grow relative z-10 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
