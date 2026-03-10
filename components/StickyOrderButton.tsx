'use client'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function StickyOrderButton() {
  const pathname = usePathname()
  const router = useRouter()
  const { count, setIsOpen } = useCart()
  const [hovered, setHovered] = useState(false)

  if (pathname === '/menu') return null

  const handleClick = () => {
    if (pathname !== '/menu') {
      router.push('/menu')
    } else {
      setIsOpen(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-8 right-8 z-40 flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] uppercase font-semibold text-black transition-all duration-300"
      style={{
        background: 'var(--gold)',
        padding: hovered ? '14px 24px' : '14px',
        borderRadius: '50px',
        boxShadow: hovered ? '0 0 30px rgba(201,168,76,0.5)' : '0 4px 20px rgba(201,168,76,0.3)',
      }}
    >
      <ShoppingBag size={18} />
      {hovered && <span>ORDER NOW</span>}
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-sans text-[10px] font-bold text-black"
          style={{ background: '#fff' }}
        >
          {count}
        </span>
      )}
    </button>
  )
}
