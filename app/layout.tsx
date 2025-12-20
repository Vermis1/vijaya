import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/JsonLd';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import PublicHeader from '@/components/PublicHeader';


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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Vijaya - Cultivo Orgánico de Cannabis',
    template: '%s | Vijaya',
  },
  description: 'Cultiva conocimiento orgánico con Vijaya. Blog, guías y comunidad sobre cannabis, cultivo natural y productos ecológicos.',
  keywords: [
    'cannabis',
    'cultivo orgánico',
    'fertilizantes orgánicos',
    'cultivo de cannabis',
    'blog cannabis',
    'guías de cultivo',
    'CBD',
    'cultura cannabis',
    'vijaya',
    'marihuana orgánica',
    'cannabis medicinal',
    'autocultivo',
  ],
  authors: [{ name: 'Vijaya', url: 'https://vijaya.uy' }],
  creator: 'Vijaya',
  publisher: 'Vijaya',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://vijaya.uy',
    siteName: 'Vijaya',
    title: 'Vijaya - Cultivo Orgánico de Cannabis',
    description: 'Cultiva conocimiento orgánico. Blog, guías y comunidad sobre cannabis y cultivo natural.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vijaya - Cultivo Orgánico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vijaya - Cultivo Orgánico de Cannabis',
    description: 'Cultiva conocimiento orgánico. Blog y guías sobre cannabis.',
    creator: '@vijaya',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://vijaya.uy',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body
        className={cn(
          'min-h-screen bg-vijaya-beige antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <AnalyticsTracker />

        {/* HEADER PÚBLICO */}
        <PublicHeader />

        {/* CONTENIDO DE CADA PÁGINA */}
        {children}
      </body>
    </html>
  );
}
