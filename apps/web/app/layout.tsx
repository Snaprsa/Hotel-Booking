import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const sans = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Raha Plaza Hotel | Luxury Stay in Al Khobar',
  description: 'Experience luxury at Raha Plaza.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans bg-neutral-50 text-dark`}>
        <header className="bg-dark text-white py-6 border-b-4 border-gold">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-serif font-bold text-gold tracking-widest">RAHA PLAZA</a>
            <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
              <a href="#" className="hover:text-gold transition">Rooms</a>
              <a href="#" className="hover:text-gold transition">Dining</a>
              <a href="#" className="hover:text-gold transition">Offers</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-dark text-white py-12 mt-20">
          <div className="container mx-auto px-4 text-center text-neutral-400">
            <p>&copy; 2025 Raha Plaza Hotel. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
