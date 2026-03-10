'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'
import Ticker from '@/components/Ticker'
import { storage } from '@/lib/storage'
import { Order } from '@/lib/types'
import { getStatusStep, formatDateTime, formatPriceShort } from '@/lib/utils'
import { Search, Package, ChefHat, CheckCircle, Truck, Star } from 'lucide-react'

const DEMO_REFS = [
  { ref: 'QB-482910', label: 'Received' },
  { ref: 'QB-391047', label: 'Preparing' },
  { ref: 'QB-558821', label: 'Ready' },
  { ref: 'QB-203765', label: 'Delivered' },
]

const STEPS = [
  { key: 'received', icon: Package, label: 'Order Received' },
  { key: 'preparing', icon: ChefHat, label: 'Preparing' },
  { key: 'ready', icon: CheckCircle, label: 'Ready for Collection' },
  { key: 'out-for-delivery', icon: Truck, label: 'Out for Delivery' },
  { key: 'delivered', icon: Star, label: 'Delivered' },
]

function TrackingContent() {
  const searchParams = useSearchParams()
  const [ref, setRef] = useState(searchParams.get('ref') ?? '')
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const urlRef = searchParams.get('ref')
    if (urlRef) {
      setRef(urlRef)
      doSearch(urlRef)
    }
  }, [])

  const doSearch = (r: string) => {
    const orders = storage.getOrders()
    const found = orders.find(o => o.id.toLowerCase() === r.toLowerCase().trim())
    if (found) { setOrder(found); setNotFound(false) }
    else { setOrder(null); setNotFound(true) }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(ref)
  }

  const step = order ? getStatusStep(order.status) : -1

  return (
    <main style={{ background: 'var(--black)' }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '45vh' }}>
        <Image src="/images/photo-10.jpg" alt="Track your order" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} />
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-16 max-w-[1440px] mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>— REAL-TIME UPDATES</p>
          <h1 className="font-serif leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--text-primary)' }}>
            Track your<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>order</em>
          </h1>
          <p className="font-sans text-sm mt-4" style={{ color: 'rgba(245,240,232,0.7)' }}>
            Enter your order reference to see live status updates.
          </p>
        </div>
      </section>

      <Ticker />

      {/* Search section */}
      <section className="py-20 px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <div>
              <p className="font-sans text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--gold)' }}>ORDER REFERENCE NUMBER</p>
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                  value={ref}
                  onChange={e => setRef(e.target.value)}
                  placeholder="e.g. QB-482910"
                  className="flex-1 px-4 py-4 font-sans text-sm"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button type="submit" className="btn-primary px-6 flex items-center gap-2">
                  <Search size={16} />
                  TRACK
                </button>
              </form>

              <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>DEMO ORDERS — QUICK FILL</p>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_REFS.map(d => (
                  <button
                    key={d.ref}
                    onClick={() => { setRef(d.ref); doSearch(d.ref) }}
                    className="text-left p-3 transition-all duration-200 hover:border-[var(--gold)]"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                  >
                    <p className="font-sans text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{d.ref}</p>
                    <p className="font-sans text-xs" style={{ color: 'var(--gold)' }}>{d.label}</p>
                  </button>
                ))}
              </div>

              {notFound && (
                <p className="mt-6 font-sans text-sm" style={{ color: '#e57373' }}>
                  No order found for "{ref}". Please check the reference and try again.
                </p>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="relative aspect-square overflow-hidden hidden lg:block" style={{ borderRadius: '2px' }}>
              <Image src="/images/photo-2.jpg" alt="Queen Bees food" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Status display */}
      {order && (
        <section className="py-10 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto">
          <ScrollReveal>
            <div className="p-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              {/* Order details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Order Reference</p>
                  <p className="font-serif text-2xl" style={{ color: 'var(--gold)' }}>{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{formatDateTime(order.createdAt)}</p>
                  <p className="font-serif text-xl" style={{ color: 'var(--text-primary)' }}>{formatPriceShort(order.total)} ZMW</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-10">
                <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>ITEMS ORDERED</p>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>{item.name} × {item.quantity}</span>
                      <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>K{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <p className="font-sans text-xs tracking-widest uppercase mb-8" style={{ color: 'var(--text-muted)' }}>ORDER STATUS</p>
              <div className="relative">
                {/* Track line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 hidden md:block" style={{ background: 'var(--border)' }} />
                <div
                  className="absolute top-5 left-0 h-0.5 hidden md:block transition-all duration-700"
                  style={{ background: 'var(--gold)', width: step >= 0 ? `${(step / (STEPS.length - 1)) * 100}%` : '0%', boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}
                />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 relative">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon
                    const done = i <= step
                    const current = i === step
                    return (
                      <div key={s.key} className="flex flex-col items-center text-center gap-3">
                        <div
                          className="relative w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300"
                          style={{
                            background: done ? 'var(--gold)' : 'var(--card-bg)',
                            border: `2px solid ${done ? 'var(--gold)' : 'var(--border)'}`,
                            boxShadow: current ? '0 0 20px rgba(201,168,76,0.6)' : 'none',
                            animation: current ? 'pulseGold 2s ease-in-out infinite' : 'none',
                          }}
                        >
                          <Icon size={16} color={done ? '#000' : 'var(--text-muted)'} />
                        </div>
                        <p className="font-sans text-[10px] tracking-wide uppercase leading-tight" style={{ color: done ? 'var(--gold)' : 'var(--text-muted)' }}>
                          {s.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Location */}
              <div className="mt-10 pt-6 border-t flex flex-wrap gap-6" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>LOCATION</p>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>{order.location === 'longacres' ? 'Longacres Mall' : 'KKIA Airport'}</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>TYPE</p>
                  <p className="font-sans text-sm capitalize" style={{ color: 'var(--text-primary)' }}>{order.type}</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>PAYMENT</p>
                  <p className="font-sans text-sm capitalize" style={{ color: 'var(--text-primary)' }}>{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}
    </main>
  )
}

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  )
}
