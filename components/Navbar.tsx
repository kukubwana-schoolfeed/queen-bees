'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/menu', label: 'MENU' },
  { href: '/reserve', label: 'RESERVE' },
  { href: '/about', label: 'OUR STORY' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/account', label: 'MY ACCOUNT' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          padding: scrolled ? '10px 0' : '18px 0',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-serif text-xl" style={{ color: 'var(--gold)' }}>QUEEN BEES</span>
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-muted)' }}>RESTAURANT</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[13px] tracking-[0.15em] uppercase transition-colors duration-200"
                style={{
                  color: pathname === link.href ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottom: pathname === link.href ? '1px solid var(--gold)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Book a Table CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/reserve" className="hidden lg:block btn-outline text-[11px] py-3 px-6">
              BOOK A TABLE
            </Link>
            <button
              className="lg:hidden text-[var(--gold)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ background: '#0A0A0A' }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-serif text-xl" style={{ color: 'var(--gold)' }}>QUEEN BEES</span>
            <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold)' }}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-serif text-3xl transition-colors"
                style={{ color: pathname === link.href ? 'var(--gold)' : 'var(--text-primary)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/reserve" onClick={() => setMobileOpen(false)} className="btn-primary mt-4">
              BOOK A TABLE
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
