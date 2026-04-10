import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dr. Halima Suleiman Zakari - Campaign 2025 | ڈاکٹر حلیمہ سلیمان زکری',
  description: 'Join the movement for positive change. Support Dr. Halima Suleiman Zakari\'s gubernatorial campaign in 2025.',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://halima-campaign.ng',
    title: 'Dr. Halima Suleiman Zakari - Campaign 2025',
    description: 'Join the movement for positive change',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Halima Suleiman Zakari Campaign',
      },
    ],
  },
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
