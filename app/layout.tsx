import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Rubik, Work_Sans } from 'next/font/google'
import './globals.css'
import { COMPANY } from '@/lib/utils'
import { AppProviders } from '@/components/app-providers'

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
  display: 'swap',
})

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: `${COMPANY.name} | Complete Medical & Laboratory Solutions`,
  description: 'Tarumed supplies medical equipment, laboratory solutions, hospital furniture and healthcare products to hospitals and clinics across Kenya.',
  applicationName: COMPANY.name,
  icons: {
    icon: COMPANY.logo,
    shortcut: COMPANY.logo,
    apple: COMPANY.logo,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: COMPANY.url,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Complete Medical & Laboratory Solutions`,
    description: 'Medical equipment, laboratory solutions, hospital furniture and healthcare products for hospitals and clinics across Kenya.',
    images: [{ url: COMPANY.logo, width: 300, height: 100, alt: COMPANY.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} | Complete Medical & Laboratory Solutions`,
    description: 'Medical equipment, laboratory solutions, hospital furniture and healthcare products for hospitals and clinics across Kenya.',
    images: [COMPANY.logo],
  },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#061018' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: COMPANY.url,
    logo: `${COMPANY.url}${COMPANY.logo}`,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eldoret',
      addressRegion: 'Uasin Gishu',
      addressCountry: 'KE',
    },
  }

  return (
    <html lang="en" className={`${workSans.variable} ${rubik.variable} bg-background`} data-scroll-behavior="smooth">
      <body className={`${workSans.className} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <AppProviders>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AppProviders>
      </body>
    </html>
  )
}
