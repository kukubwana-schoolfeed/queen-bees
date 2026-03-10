'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import Ticker from '@/components/Ticker'
import CartSidebar from '@/components/CartSidebar'
import PaymentModal from '@/components/PaymentModal'
import { useCart } from '@/context/CartContext'
import { storage } from '@/lib/storage'
import { MenuItem } from '@/lib/types'

type Category = 'all' | 'main' | 'sides' | 'drinks'

const SIDE_ICONS: Record<string, string> = {
  Chibwabwa: '🌿', Ifisashi: '🥬', Kalembula: '🍃', Bondwe: '🌱',
  Delele: '🫛', Impwa: '🍆', Katapa: '🌿', Nshima: '🫓',
}
const DRINK_ICONS: Record<string, string> = {
  Maheu: '🥛', 'Hibiscus Juice': '🌺', 'Tamarind Drink': '🍹',
  'Still Water': '💧', 'Sparkling Water': '✨', 'Zambian Ginger Beer': '🍺',
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [addedId, setAddedId] = useState<string | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const { addItem, setIsOpen, count } = useCart()
  const mainRef = useRef<HTMLDivElement>(null)
  const sidesRef = useRef<HTMLDivElement>(null)
  const drinksRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMenu(storage.getMenu())
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image })
    setAddedId(item.id)
    setTimeout(() => setAddedId(null), 600)
  }

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tabs: { id: Category; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'main', label: 'MAIN DISHES' },
    { id: 'sides', label: 'VEGETABLE SIDES' },
    { id: 'drinks', label: 'DRINKS' },
  ]

  const mains = menu.filter(m => m.category === 'main')
  const sides = menu.filter(m => m.category === 'sides')
  const drinks = menu.filter(m => m.category === 'drinks')

  return (
    <>
      <main style={{ background: 'var(--black)' }} className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height: '50vh' }}>
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <Image
              src="/images/photo-5.jpg"
              alt="Queen Bees Menu"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} />
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-16 max-w-[1440px] mx-auto">
            <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
              — TRADITIONAL ZAMBIAN CUISINE
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--text-primary)', lineHeight: 1 }}>
              Our <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Menu</em>
            </h1>
          </div>
        </section>

        <Ticker />

        {/* Filter Tabs */}
        <div
          className="sticky top-[56px] z-30 border-b overflow-x-auto"
          style={{ background: 'rgba(10,10,10,0.98)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}
        >
          <div className="flex max-w-[1440px] mx-auto px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id === 'main') scrollTo(mainRef)
                  else if (tab.id === 'sides') scrollTo(sidesRef)
                  else if (tab.id === 'drinks') scrollTo(drinksRef)
                }}
                className="font-sans text-[11px] tracking-[0.2em] uppercase py-4 px-5 whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottomColor: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
            {count > 0 && (
              <button
                onClick={() => setIsOpen(true)}
                className="ml-auto font-sans text-[11px] tracking-[0.2em] uppercase py-4 px-5 whitespace-nowrap transition-colors hover:text-[var(--gold)]"
                style={{ color: 'var(--gold)' }}
              >
                VIEW CART ({count})
              </button>
            )}
          </div>
        </div>

        {/* MAINS */}
        {(activeTab === 'all' || activeTab === 'main') && (
          <section ref={mainRef} className="py-20 md:py-28 px-6 md:px-16 max-w-[1440px] mx-auto">
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-serif text-6xl" style={{ color: 'rgba(201,168,76,0.15)' }}>01</span>
                <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
                  Main <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Dishes</em>
                </h2>
              </div>
              <p className="font-sans text-sm max-w-xl mb-12" style={{ color: 'var(--text-muted)' }}>
                Every main dish comes with hand-formed nshima. Made fresh. Served with tradition.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mains.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.05}>
                  <div className="group relative flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #2d1a00 50%, #0a0a0a 100%)' }} />
                      )}
                      {item.badge && (
                        <span className="absolute top-3 left-3 font-sans text-[10px] tracking-[0.15em] px-2 py-1 uppercase" style={{ background: 'var(--gold)', color: '#000' }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                      <p className="font-sans text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map(tag => (
                            <span key={tag} className="font-sans text-[9px] tracking-[0.15em] px-2 py-1 uppercase" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-lg" style={{ color: 'var(--gold)' }}>K{item.price} ZMW</span>
                        <motion.button
                          onClick={() => handleAdd(item)}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 flex items-center justify-center font-sans font-bold transition-all duration-200"
                          style={{
                            background: addedId === item.id ? 'var(--gold-light)' : 'var(--gold)',
                            color: '#000',
                            boxShadow: addedId === item.id ? '0 0 20px rgba(201,168,76,0.6)' : 'none',
                          }}
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* SIDES */}
        {(activeTab === 'all' || activeTab === 'sides') && (
          <section ref={sidesRef} className="py-20 md:py-28 px-6 md:px-16" style={{ background: 'var(--black-soft)' }}>
            <div className="max-w-[1440px] mx-auto">
              <ScrollReveal>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-serif text-6xl" style={{ color: 'rgba(201,168,76,0.15)' }}>02</span>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
                    Vegetable <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Sides</em>
                  </h2>
                </div>
                <p className="font-sans text-sm max-w-xl mb-12" style={{ color: 'var(--text-muted)' }}>
                  Traditional Zambian greens, each one a celebration of local produce.
                </p>
              </ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sides.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 0.04}>
                    <div className="p-5 flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                      <span className="text-3xl mb-3">{SIDE_ICONS[item.name] ?? '🌿'}</span>
                      <h3 className="font-serif text-base mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                      {item.tags.length > 0 && (
                        <span className="font-sans text-[9px] tracking-[0.1em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
                          {item.tags[0]}
                        </span>
                      )}
                      <p className="font-sans text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-serif" style={{ color: 'var(--gold)' }}>K{item.price}</span>
                        <motion.button
                          onClick={() => handleAdd(item)}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-200"
                          style={{
                            background: addedId === item.id ? 'var(--gold-light)' : 'var(--gold)',
                            color: '#000',
                          }}
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DRINKS */}
        {(activeTab === 'all' || activeTab === 'drinks') && (
          <section ref={drinksRef} className="py-20 md:py-28 px-6 md:px-16 max-w-[1440px] mx-auto">
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-serif text-6xl" style={{ color: 'rgba(201,168,76,0.15)' }}>03</span>
                <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
                  <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Drinks</em>
                </h2>
              </div>
              <p className="font-sans text-sm max-w-xl mb-12" style={{ color: 'var(--text-muted)' }}>
                Natural, traditional, and refreshing. Drinks as honest as our food.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinks.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.05}>
                  <div className="p-6 flex items-center gap-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <span className="text-4xl">{DRINK_ICONS[item.name] ?? '🥤'}</span>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                      {item.tags.length > 0 && (
                        <span className="font-sans text-[9px] tracking-[0.15em] uppercase" style={{ color: 'var(--gold)' }}>{item.tags[0]}</span>
                      )}
                      <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="font-serif text-lg" style={{ color: 'var(--gold)' }}>K{item.price}</span>
                      <motion.button
                        onClick={() => handleAdd(item)}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 flex items-center justify-center transition-all duration-200"
                        style={{
                          background: addedId === item.id ? 'var(--gold-light)' : 'var(--gold)',
                          color: '#000',
                        }}
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <CartSidebar onCheckout={() => setPaymentOpen(true)} />
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  )
}
