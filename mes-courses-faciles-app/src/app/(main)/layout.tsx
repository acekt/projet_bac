import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-grow">
        {children}
      </main>
      <BottomTabBar />
    </>
  );
}
