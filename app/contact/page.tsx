'use client'
import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import { Phone, MessageCircle, Mail, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
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
    <main style={{ background: 'var(--black)' }} className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>— REACH OUT</p>
          <h1 className="font-serif mb-4" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text-primary)', lineHeight: 1 }}>
            Get in <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Touch</em>
          </h1>
          <p className="font-sans text-base" style={{ color: 'var(--text-muted)' }}>We'd love to hear from you.</p>
        </ScrollReveal>
      </section>

      {/* Two columns */}
      <section className="py-10 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <ScrollReveal>
            <div className="space-y-8">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>PHONE</p>
                <div className="flex items-center gap-3 mb-4">
                  <Phone size={18} style={{ color: 'var(--gold)' }} />
                  <span className="font-sans text-base" style={{ color: 'var(--text-primary)' }}>+260 972 323 218</span>
                </div>
                <a
                  href="https://wa.me/260972323218"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                  style={{ background: '#25D366', color: '#000' }}
                >
                  <MessageCircle size={14} />
                  CHAT ON WHATSAPP
                </a>
              </div>

              <div>
                <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>EMAIL</p>
                <div className="flex items-center gap-3">
                  <Mail size={18} style={{ color: 'var(--gold)' }} />
                  <span className="font-sans text-base" style={{ color: 'var(--text-primary)' }}>hello@queenbees.zm</span>
                </div>
              </div>

              <div>
                <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>OPENING HOURS</p>
                <div className="flex items-start gap-3">
                  <Clock size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="font-sans text-base" style={{ color: 'var(--text-primary)' }}>Monday – Sunday</p>
                    <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>10:00 – 21:00 · Both locations</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal delay={0.1}>
            <h2 className="font-serif text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>
              Send a <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Message</em>
            </h2>
            {sent && (
              <div className="mb-6 px-4 py-3 font-sans text-sm" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)', color: 'var(--gold)' }}>
                Message sent! We'll be in touch soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              <input style={inputStyle} type="email" placeholder="Email Address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }} placeholder="Your message..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
              <button type="submit" className="btn-primary w-full">SEND MESSAGE →</button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* Maps / Locations */}
      <section className="py-20 px-6 md:px-16" style={{ background: 'var(--black-soft)' }}>
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal>
            <h2 className="font-serif mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
              Our <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Locations</em>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Longacres Mall', address: 'Longacres Mall, Great East Road, Lusaka, Zambia', mapUrl: 'https://www.google.com/maps?q=Longacres+Mall+Lusaka' },
              { name: 'KKIA Airport', address: 'Kenneth Kaunda International Airport, Lusaka, Zambia', mapUrl: 'https://www.google.com/maps?q=Kenneth+Kaunda+International+Airport+Lusaka' },
            ].map((loc, i) => (
              <ScrollReveal key={loc.name} delay={i * 0.1}>
                <div className="overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="p-6 flex flex-col gap-4" style={{ background: 'var(--card-bg)' }}>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{loc.name}</h3>
                        <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{loc.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: 'var(--gold)' }} />
                      <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Mon – Sun: 10:00 – 21:00</span>
                    </div>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-xs py-3 px-6 inline-block text-center"
                    >
                      GET DIRECTIONS →
                    </a>
                  </div>
                  {/* Map placeholder */}
                  <div
                    className="w-full h-48 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)' }}
                  >
                    <div className="text-center">
                      <MapPin size={32} style={{ color: 'var(--border)', margin: '0 auto 8px' }} />
                      <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{loc.name}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
