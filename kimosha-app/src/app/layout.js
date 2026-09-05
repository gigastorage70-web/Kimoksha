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
  title: 'Kimosha Telecom | Global Carrier Network Hub',
  description: 'Connecting Tier-1 telecom operators, international mobile networks, and enterprise aggregators across 200+ countries with dynamic least-cost routing and sub-second delivery SLAs.',
  keywords: ['telecom', 'carrier hub', 'wholesale SMS', 'voice termination', 'A2P messaging', 'SMPP 3.4', 'SIP trunking', 'Dubai DX1'],
  openGraph: {
    title: 'Kimosha Telecom | Global Carrier Network Hub',
    description: 'Connecting Tier-1 telecom operators and international mobile networks across 200+ countries.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#F26522',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
