import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: { default: 'Hotel MS', template: '%s | Hotel MS' },
  description: 'Hotel Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className + ' bg-light'}>
        {children}
      </body>
    </html>
  );
}
