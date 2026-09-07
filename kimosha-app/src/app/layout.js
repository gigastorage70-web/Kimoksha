import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.kimokshatelco.com'),
  title: {
    default: 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub',
    template: '%s | Kimoksha Telecom',
  },
  description:
    'International wholesale telecommunications carrier headquartered in Northampton, United Kingdom. Providing Tier-1 SMS termination, SIP voice trunking, A2P OTP messaging, and high-throughput SMPP 3.4 APIs across 200+ countries with sub-second delivery SLAs.',
  keywords: [
    'wholesale telecom carrier',
    'SMS termination',
    'wholesale voice',
    'SIP trunking',
    'A2P messaging',
    'OTP delivery',
    'SMPP 3.4 API',
    'CPaaS carrier',
    'telecom hub London',
    'telecom carrier UK',
    'Equinix LD4',
    'Equinix FR2',
    'Equinix DX1',
    'Equinix SG1',
    'least cost routing',
    'carrier interconnect',
  ],
  authors: [{ name: 'Kimoksha Telecom' }],
  creator: 'Kimoksha Telecom',
  publisher: 'Kimoksha Telecom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub',
    description:
      'Connecting Tier-1 telecom operators and enterprise aggregators across 200+ countries with bilateral routing agreements and 99.99% network uptime SLA.',
    url: 'https://www.kimokshatelco.com',
    siteName: 'Kimoksha Telecom',
    images: [
      {
        url: '/kimoksha-logo-clean.png',
        width: 974,
        height: 255,
        alt: 'Kimoksha Telecom Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kimoksha Telecom | Wholesale SMS & Voice Carrier Hub',
    description:
      'International wholesale telecom carrier providing SMS termination, SIP trunking, and carrier CPaaS infrastructure.',
    images: ['/kimoksha-logo-clean.png'],
  },
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
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#F26522',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TelecommunicationsProvider',
      '@id': 'https://www.kimokshatelco.com/#organization',
      name: 'Kimoksha Telecom',
      alternateName: ['Kimoksha Telco', 'Kimoksha Telecom UK'],
      url: 'https://www.kimokshatelco.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.kimokshatelco.com/kimoksha-logo-clean.png',
        width: 974,
        height: 255,
      },
      description:
        'International wholesale telecommunications provider operating high-capacity signaling and voice exchange hubs across London, Frankfurt, Dubai, and Singapore.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '90 West Street, Upton',
        addressLocality: 'Northampton',
        postalCode: 'NN5 4XL',
        addressCountry: 'GB',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'technical support',
          email: 'noc@kimokshatelco.com',
          availableLanguage: ['English', 'Arabic'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'sales@kimokshatelco.com',
          availableLanguage: ['English', 'Arabic'],
        },
      ],
      sameAs: [
        'https://www.linkedin.com/company/kimoksha-telecom',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.kimokshatelco.com/#website',
      url: 'https://www.kimokshatelco.com',
      name: 'Kimoksha Telecom',
      publisher: {
        '@id': 'https://www.kimokshatelco.com/#organization',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
