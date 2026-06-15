import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { cn } from "@/lib/utils";
import { AuthModalWrapper } from "@/components/blocks/auth/AuthModalWrapper";
import { ToastProvider } from "@/context/ToastContext";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Mes Achats 241 | Le meilleur des magasins de Libreville à votre porte",
  description: "Faites vos courses en ligne dans les plus grands magasins du Gabon (Mbolo, Géant Casino, Prix Import) et faites-vous livrer rapidement.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} font-sans min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                {children}
                <AuthModalWrapper />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
