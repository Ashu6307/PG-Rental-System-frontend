export const metadata = {
  title: 'PG & Room Rental - Best Accommodation for Students & Professionals',
  description: 'Find verified PGs, rooms, and flats for rent. Secure payments, best prices, and easy booking for students and working professionals.',
  keywords: ['PG', 'Room', 'Flat', 'Rental', 'Accommodation', 'Student Housing', 'Paying Guest', 'Hostel', 'Best Price', 'Verified Properties'],
  openGraph: {
    title: 'PG & Room Rental - Best Accommodation for Students & Professionals',
    description: 'Find verified PGs, rooms, and flats for rent. Secure payments, best prices, and easy booking for students and working professionals.',
    url: 'https://pgroomrental.com/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PG & Room Rental Banner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG & Room Rental - Best Accommodation for Students & Professionals',
    description: 'Find verified PGs, rooms, and flats for rent. Secure payments, best prices, and easy booking for students and working professionals.',
    images: ['/og-image.png'],
    site: '@pgroomrental',
  },
  robots: 'index, follow',
  authors: [{ name: 'PG & Room Rental Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

import HomeClient from './HomeClient';

export default function HomePage() {
  return <HomeClient />;
}
