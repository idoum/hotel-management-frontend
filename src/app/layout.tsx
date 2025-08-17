import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Hotel Management System',
    template: '%s | Hotel Management',
  },
  description: 'Système de gestion hôtelière moderne et intuitif',
  keywords: ['hôtel', 'gestion', 'réservation', 'management'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        <div id="portal" />
      </body>
    </html>
  );
}
