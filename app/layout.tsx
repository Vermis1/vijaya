import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vijaya - Blog de Cannabis y Cultura',
  description: 'Plataforma moderna de contenido sobre cannabis, cultura y comunidad',
  keywords: ['cannabis', 'blog', 'cultura', 'vijaya'],
  authors: [{ name: 'Vijaya' }],
  openGraph: {
    title: 'Vijaya - Blog de Cannabis y Cultura',
    description: 'Plataforma moderna de contenido sobre cannabis, cultura y comunidad',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className={cn(
          'min-h-screen bg-vijaya-beige antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}