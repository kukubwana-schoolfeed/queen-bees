'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MapPin, Clock } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import Ticker from '@/components/Ticker'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.4}px)`,
  }

  return (
    <main style={{ background: 'var(--black)' }}>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0" style={parallaxStyle}>
          <Image
            src="/images/photo-3.jpg"
            alt="Queen Bees Restaurant — Authentic Zambian Cuisine"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.60)' }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-16 max-w-[1440px] mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--gold)' }}>
            — LOCALLY GROWN · NATURALLY PREPARED
          </p>
          <h1 className="font-serif leading-none mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: 'var(--text-primary)' }}>
            Where<br />
            Zambia<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Eats Well</em>
          </h1>
          <p className="font-sans text-base md:text-lg mb-10 max-w-md leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)' }}>
            Fresh from Zambian soil. Cooked the way our grandmothers taught us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/menu" className="btn-primary text-center">
              EXPLORE MENU →
            </Link>
            <Link href="/reserve" className="btn-outline text-center">
              BOOK A TABLE
            </Link>
          </div>
        </div>

        {/* Scroll chevron */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          style={{ color: 'var(--gold)', animation: 'bounceY 1.5s ease-in-out infinite' }}
        >
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ─── TICKER ───────────────────────────────────────────── */}
      <Ticker />

      {/* ─── FEATURED DISHES ──────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            — FROM OUR KITCHEN
          </p>
          <h2 className="font-serif mb-16" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-primary)' }}>
            Our <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Finest</em>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Bream with 4 Vegetable Sides', price: 285, badge: 'SIGNATURE', img: '/images/bream.png' },
            { name: 'Village Chicken with 3 Sides', price: 295, badge: 'FAN FAVOURITE', img: '/images/village-chicken.png' },
            { name: 'Goat Meat with 4 Sides', price: 350, badge: '', img: '/images/goat-meat.png' },
          ].map((dish, i) => (
            <ScrollReveal key={dish.name} delay={i * 0.1}>
              <Link href="/menu" className="group block relative overflow-hidden" style={{ borderRadius: '2px' }}>
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <Image
                    src={dish.img}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {dish.badge && (
                    <span className="absolute top-4 left-4 font-sans text-[10px] tracking-[0.2em] px-2 py-1" style={{ background: 'var(--gold)', color: '#000' }}>
                      {dish.badge}
                    </span>
                  )}
                  {/* Hover price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300">
                    <p className="font-serif text-lg" style={{ color: 'var(--text-primary)' }}>{dish.name}</p>
                    <p className="font-serif text-xl" style={{ color: 'var(--gold)' }}>K{dish.price} ZMW</p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── PHILOSOPHY ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: 'var(--black-soft)' }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <h2 className="font-serif leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--text-primary)' }}>
              Real food.<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Real ingredients.</em>
            </h2>
          </ScrollReveal>
          <div className="space-y-8">
            {[
              { icon: '🌿', title: 'Locally Sourced', desc: 'Every ingredient grown on Zambian soil' },
              { icon: '🔥', title: 'No Additives', desc: 'No preservatives, no shortcuts, no compromise' },
              { icon: '👩‍🍳', title: 'Traditional Methods', desc: 'Recipes passed down through generations' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex gap-5 items-start">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-sans font-semibold text-base mb-1 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY TEASER ─────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: '2px' }}>
              <Image
                src="/images/clients.png"
                alt="Queen Bees Restaurant guests dining"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
              Est. 2019 · Lusaka, Zambia
            </p>
            <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--text-primary)' }}>
              Born from <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>tradition.</em>
            </h2>
            <p className="font-sans text-base leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
              Queen Bees started with one table at Longacres Mall and a belief that Zambian food deserved a world-class stage.
            </p>
            <Link href="/about" className="btn-outline">
              READ OUR STORY →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── LOCATIONS ────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: 'var(--black-soft)' }}>
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal>
            <h2 className="font-serif mb-16 text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              Find <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Us</em>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Longacres Mall', address: 'Longacres Mall, Great East Road, Lusaka' },
              { name: 'KKIA Airport', address: 'Kenneth Kaunda International Airport, Lusaka' },
            ].map((loc, i) => (
              <ScrollReveal key={loc.name} delay={i * 0.1}>
                <div
                  className="p-8"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '2px' }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin size={20} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{loc.name}</h3>
                      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{loc.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={16} style={{ color: 'var(--gold)' }} />
                    <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Mon – Sun: 10:00 – 21:00</span>
                  </div>
                  <Link href="/contact" className="btn-outline text-sm py-3 px-6">
                    GET DIRECTIONS →
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
