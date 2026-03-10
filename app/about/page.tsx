'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

const TIMELINE = [
  { year: '2019', title: 'The First Table', desc: 'Queen Bees opened its first location at Longacres Mall with a small menu, a big vision, and a belief that Zambian food deserved a world-class stage.' },
  { year: '2020', title: 'Growing Through the Pandemic', desc: 'When the world stopped, we kept cooking. Our community rallied, and Queen Bees became a symbol of resilience for Lusaka.' },
  { year: '2021', title: 'Second Location Opens', desc: 'KKIA Airport — bringing authentic Zambian cuisine to travellers and international guests arriving in Lusaka for the first time.' },
  { year: '2023', title: 'The Hive Card Launches', desc: 'Our loyalty programme rewards every meal. The Hive Card — because every customer deserves to feel like royalty.' },
  { year: '2025', title: 'Today', desc: 'Two locations. Thousands of meals. One mission: to show the world that Zambian food is extraordinary.' },
]

const VALUES = [
  { icon: '🌿', title: 'Our Ingredients', desc: 'Every ingredient is sourced from Zambian farmers. We know where our food comes from — and we are proud of it.' },
  { icon: '👥', title: 'Our People', desc: 'Our team is Zambian, our recipes are Zambian, our heart is Zambian. We invest in people who believe in this country.' },
  { icon: '🎯', title: 'Our Mission', desc: 'To serve the most authentic, most nourishing, most beautiful Zambian food on the planet. Nothing less.' },
]

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--black)' }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '70vh' }}>
        <Image src="/images/download-2.png" alt="Queen Bees Founders" fill className="object-cover object-top" priority />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.60)' }} />
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-[1440px] mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>Est. 2019 · Lusaka, Zambia</p>
          <h1 className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', color: 'var(--text-primary)' }}>
            Our<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Story</em>
          </h1>
          <p className="font-sans text-base md:text-lg mt-5 max-w-xl leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)' }}>
            Born from a deep love of Zambian tradition. Built into a dining destination that welcomes the world.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <p className="font-sans text-xs tracking-[0.3em] uppercase mb-3 text-center" style={{ color: 'var(--gold)' }}>OUR JOURNEY</p>
            <h2 className="font-serif text-center mb-20" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              How we <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>got here</em>
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: 'var(--border)', transform: 'translateX(-50%)' }} />

            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 0.08}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                      <span className="font-serif text-5xl block mb-2" style={{ color: 'var(--gold)', opacity: 0.7 }}>{item.year}</span>
                      <h3 className="font-serif text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    {/* Dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="hidden md:flex w-5 h-5 rounded-full flex-shrink-0 items-center justify-center"
                      style={{ background: 'var(--gold)', boxShadow: '0 0 20px rgba(201,168,76,0.4)', zIndex: 1 }}
                    />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: 'var(--black-soft)' }}>
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-center mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              What we <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>believe</em>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="p-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <span className="text-4xl block mb-4">{v.icon}</span>
                  <h3 className="font-serif text-xl mb-4" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <ScrollReveal>
        <section className="py-20 px-6 md:px-16" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="font-serif text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Come taste <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Zambia.</em>
            </h2>
            <div className="flex gap-4">
              <Link href="/menu" className="btn-primary">VIEW MENU →</Link>
              <Link href="/reserve" className="btn-outline">BOOK A TABLE →</Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  )
}
