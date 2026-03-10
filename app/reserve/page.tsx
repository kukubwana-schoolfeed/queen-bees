'use client'
import { useState } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'
import Ticker from '@/components/Ticker'
import { storage } from '@/lib/storage'
import { generateResId } from '@/lib/utils'
import { fireGoldConfetti } from '@/lib/confetti'
import Link from 'next/link'

type Tab = 'book' | 'order'

export default function ReservePage() {
  const [tab, setTab] = useState<Tab>('book')
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: 2, location: 'longacres' as 'longacres' | 'kkia', occasion: '', requests: '' })
  const [success, setSuccess] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const TODAY = new Date().toISOString().split('T')[0]

  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const totalMins = 10 * 60 + i * 30
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name required'
    if (!form.phone.trim()) e.phone = 'Phone required'
    if (!form.email.trim()) e.email = 'Email required'
    if (!form.date) e.date = 'Date required'
    else if (form.date < TODAY) e.date = 'Cannot book past dates'
    if (!form.time) e.time = 'Time required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const id = generateResId()
    storage.addReservation({
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: form.time,
      guests: form.guests,
      location: form.location,
      occasion: form.occasion || undefined,
      specialRequests: form.requests || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    })
    await fireGoldConfetti()
    setSuccess(id)
  }

  const inputStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '12px 16px',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    outline: 'none',
  }

  return (
    <main style={{ background: 'var(--black)' }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '45vh' }}>
        <Image src="/images/download-4.png" alt="Reserve at Queen Bees" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} />
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 md:px-16 max-w-[1440px] mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>— BOOK YOUR EXPERIENCE</p>
          <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text-primary)', lineHeight: 1 }}>
            Reserve Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Table</em>
          </h1>
        </div>
      </section>

      <Ticker />

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--black)' }}>
        <div className="max-w-[1440px] mx-auto px-6 flex">
          {([['book', 'BOOK A TABLE'], ['order', 'PLACE AN ORDER']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="font-sans text-[11px] tracking-[0.2em] uppercase py-5 px-6 border-b-2 transition-all duration-200"
              style={{ color: tab === id ? 'var(--gold)' : 'var(--text-muted)', borderBottomColor: tab === id ? 'var(--gold)' : 'transparent' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-24">
        {tab === 'book' && (
          <>
            {success ? (
              <ScrollReveal>
                <div className="max-w-lg mx-auto text-center py-16">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid var(--gold)' }}>
                    <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                      <path d="M12 26 L22 36 L38 18" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'drawCheck 0.6s ease forwards', strokeDasharray: 200, strokeDashoffset: 200 }} />
                    </svg>
                  </div>
                  <h2 className="font-serif text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    Reservation <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Confirmed</em>
                  </h2>
                  <p className="font-sans text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Your reservation reference:</p>
                  <p className="font-serif text-2xl mb-6" style={{ color: 'var(--gold)' }}>{success}</p>
                  <p className="font-sans text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                    Table for {form.guests} on {form.date} at {form.time} · {form.location === 'longacres' ? 'Longacres Mall' : 'KKIA Airport'}
                  </p>
                  <button onClick={() => { setSuccess(null); setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, location: 'longacres', occasion: '', requests: '' }) }} className="btn-outline">
                    MAKE ANOTHER RESERVATION
                  </button>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <ScrollReveal>
                  <h2 className="font-serif text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    Book a <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Table</em>
                  </h2>
                  <p className="font-sans text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                    Reserve your seat at Queen Bees. We'll have everything ready for you.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        {errors.name && <p className="font-sans text-xs mt-1" style={{ color: '#e57373' }}>{errors.name}</p>}
                      </div>
                      <div>
                        <input style={inputStyle} placeholder="Phone Number *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                        {errors.phone && <p className="font-sans text-xs mt-1" style={{ color: '#e57373' }}>{errors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <input style={inputStyle} type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                      {errors.email && <p className="font-sans text-xs mt-1" style={{ color: '#e57373' }}>{errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <input style={inputStyle} type="date" min={TODAY} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                        {errors.date && <p className="font-sans text-xs mt-1" style={{ color: '#e57373' }}>{errors.date}</p>}
                      </div>
                      <div>
                        <select style={{ ...inputStyle, appearance: 'none' }} value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                          <option value="">Select Time *</option>
                          {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors.time && <p className="font-sans text-xs mt-1" style={{ color: '#e57373' }}>{errors.time}</p>}
                      </div>
                    </div>
                    {/* Guests */}
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Guests:</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>−</button>
                      <span className="font-serif text-xl w-8 text-center" style={{ color: 'var(--text-primary)' }}>{form.guests}</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>+</button>
                    </div>
                    {/* Location */}
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Location</p>
                      <div className="grid grid-cols-2 gap-3">
                        {([['longacres', 'Longacres Mall', 'Great East Road, Lusaka'], ['kkia', 'KKIA Airport', 'Kenneth Kaunda International']] as const).map(([id, name, sub]) => (
                          <button key={id} type="button" onClick={() => setForm(p => ({ ...p, location: id }))}
                            className="p-4 text-left transition-all duration-200"
                            style={{ border: `1px solid ${form.location === id ? 'var(--gold)' : 'var(--border)'}`, background: form.location === id ? 'rgba(201,168,76,0.08)' : 'var(--card-bg)', boxShadow: form.location === id ? '0 0 20px rgba(201,168,76,0.2)' : 'none' }}>
                            <p className="font-sans text-sm font-semibold" style={{ color: form.location === id ? 'var(--gold)' : 'var(--text-primary)' }}>{name}</p>
                            <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Occasion */}
                    <select style={{ ...inputStyle, appearance: 'none' }} value={form.occasion} onChange={e => setForm(p => ({ ...p, occasion: e.target.value }))}>
                      <option value="">Special Occasion (optional)</option>
                      {['Birthday', 'Anniversary', 'Business', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <textarea
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                      placeholder="Special requests (optional)"
                      value={form.requests}
                      onChange={e => setForm(p => ({ ...p, requests: e.target.value }))}
                    />
                    <button type="submit" className="btn-primary w-full">CONFIRM RESERVATION →</button>
                  </form>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                  <div className="relative aspect-square overflow-hidden hidden lg:block" style={{ borderRadius: '2px' }}>
                    <Image src="/images/photo-8.jpg" alt="Queen Bees dining experience" fill className="object-cover" />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                    <div className="absolute bottom-8 left-8 right-8 p-6" style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid var(--border)' }}>
                      <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Opening Hours</p>
                      <p className="font-serif text-xl" style={{ color: 'var(--text-primary)' }}>Mon – Sun</p>
                      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>10:00 – 21:00</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}
          </>
        )}

        {tab === 'order' && (
          <ScrollReveal>
            <div className="max-w-lg mx-auto text-center py-8">
              <h2 className="font-serif text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>
                Place an <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Order</em>
              </h2>
              <p className="font-sans text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                Browse our full menu and add items to your cart. Pay with Airtel Money, MTN or Zamtel Kwacha.
              </p>
              <Link href="/menu" className="btn-primary">BROWSE MENU →</Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </main>
  )
}
