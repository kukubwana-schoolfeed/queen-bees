import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import '../styles/globals.css'
import { AppProvider } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StickyOrderButton from '@/components/StickyOrderButton'
import PageTransition from '@/components/PageTransition'
import SeedProvider from '@/components/SeedProvider'

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Queen Bees Restaurant — Authentic Zambian Cuisine',
  description: 'Fresh from Zambian soil. Cooked the way our grandmothers taught us. Two locations in Lusaka.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body>
        <AppProvider>
          <SeedProvider>
            <Navbar />
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
            <StickyOrderButton />
          </SeedProvider>
        </AppProvider>
      </body>
    </html>
  )
}
