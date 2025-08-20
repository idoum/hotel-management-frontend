import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from '@/providers/QueryProvider';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "Système de gestion hôtelière complet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
