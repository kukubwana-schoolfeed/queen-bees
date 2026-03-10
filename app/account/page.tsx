'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { storage } from '@/lib/storage'
import { Address } from '@/lib/types'
import { fireGoldConfetti } from '@/lib/confetti'
import { formatDate, getStatusLabel } from '@/lib/utils'
import ScrollReveal from '@/components/ScrollReveal'
import {
  User, Package, CreditCard, MapPin, Settings,
  LogOut, Plus, ChevronDown, ChevronUp,
} from 'lucide-react'

type AuthTab = 'signin' | 'create'
type DashTab = 'overview' | 'orders' | 'hive' | 'addresses' | 'profile'

const STATUS_COLORS: Record<string, string> = {
  received: '#C9A84C',
  preparing: '#E2A500',
  ready: '#4CAF50',
  'out-for-delivery': '#2196F3',
  delivered: '#4CAF50',
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '12px 16px',
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  outline: 'none',
}

function tierLabel(pts: number) {
  return pts >= 1000 ? 'Gold' : pts >= 500 ? 'Silver' : 'Bronze'
}
function tierColor(pts: number) {
  return pts >= 1000 ? '#C9A84C' : pts >= 500 ? '#A0A0A0' : '#CD7F32'
}
function tierProgress(pts: number) {
  return pts >= 1000 ? 100 : pts >= 500 ? ((pts - 500) / 500) * 100 : (pts / 500) * 100
}
function nextTier(pts: number) {
  return pts >= 1000 ? null : pts >= 500 ? 1000 : 500
}

export default function AccountPage() {
  const { user, login, register, logout, updateUser } = useAuth()

  /* ── Auth state ── */
  const [authTab, setAuthTab] = useState<AuthTab>('signin')
  const [signIn, setSignIn] = useState({ credential: '', password: '' })
  const [signInErr, setSignInErr] = useState('')
  const [create, setCreate] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [createErr, setCreateErr] = useState('')

  /* ── Dashboard state ── */
  const [dashTab, setDashTab] = useState<DashTab>('overview')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [profile, setProfile] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '' })
  const [profileSaved, setProfileSaved] = useState(false)
  const [showAddAddr, setShowAddAddr] = useState(false)
  const [newAddr, setNewAddr] = useState<{ label: Address['label']; street: string; area: string; city: string }>({
    label: 'Home', street: '', area: '', city: 'Lusaka',
  })

  const orders = user
    ? storage.getOrders().filter(o => o.userId === user.id || (user.id === 'demo' && o.userId === 'demo'))
    : []

  /* ── Handlers ── */
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(signIn.credential, signIn.password)) {
      setSignInErr('Invalid credentials. Try demo@queenbees.zm / demo1234')
    } else {
      setSignInErr('')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (create.password !== create.confirm) { setCreateErr('Passwords do not match'); return }
    const ok = register({ name: create.name, phone: create.phone, email: create.email, password: create.password })
    if (!ok) { setCreateErr('An account with this email already exists'); return }
    await fireGoldConfetti()
  }

  const handleSaveProfile = () => {
    updateUser({ name: profile.name, phone: profile.phone, email: profile.email })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const handleAddAddress = () => {
    if (!user || !newAddr.street.trim()) return
    const addr: Address = { id: 'a-' + Date.now(), ...newAddr }
    updateUser({ addresses: [...(user.addresses ?? []), addr] })
    setShowAddAddr(false)
    setNewAddr({ label: 'Home', street: '', area: '', city: 'Lusaka' })
  }

  const handleDeleteAddress = (id: string) => {
    if (!user) return
    updateUser({ addresses: user.addresses.filter(a => a.id !== id) })
  }

  /* ════════════════════════════════════════════════
     NOT LOGGED IN — Sign in / Create account
  ════════════════════════════════════════════════ */
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center relative" style={{ background: 'var(--black)' }}>
        <div className="absolute inset-0">
          <Image src="/images/download-1.png" alt="Queen Bees Restaurant" fill className="object-cover object-center" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.78)' }} />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
          <div className="p-8 md:p-10" style={{ background: 'var(--black-soft)', border: '1px solid var(--border)' }}>
            {/* Logo */}
            <div className="text-center mb-8">
              <span className="font-serif text-2xl block" style={{ color: 'var(--gold)' }}>QUEEN BEES</span>
              <h2 className="font-serif text-3xl mt-3" style={{ color: 'var(--text-primary)' }}>
                Welcome <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>back</em>
              </h2>
              <p className="font-sans text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Sign in to access your orders, Hive Card and saved addresses
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-8" style={{ borderColor: 'var(--border)' }}>
              {([['signin', 'SIGN IN'], ['create', 'CREATE ACCOUNT']] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setAuthTab(id)}
                  className="flex-1 pb-3 font-sans text-[10px] tracking-[0.2em] uppercase border-b-2 transition-colors"
                  style={{
                    color: authTab === id ? 'var(--gold)' : 'var(--text-muted)',
                    borderBottomColor: authTab === id ? 'var(--gold)' : 'transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sign In */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <input
                  style={INPUT_STYLE}
                  placeholder="+260 97X XXX XXX or email"
                  value={signIn.credential}
                  onChange={e => setSignIn(p => ({ ...p, credential: e.target.value }))}
                  required
                />
                <input
                  style={INPUT_STYLE}
                  type="password"
                  placeholder="Password"
                  value={signIn.password}
                  onChange={e => setSignIn(p => ({ ...p, password: e.target.value }))}
                  required
                />
                {signInErr && <p className="font-sans text-xs" style={{ color: '#e57373' }}>{signInErr}</p>}
                <button type="submit" className="btn-primary w-full mt-2">SIGN IN →</button>
                <button
                  type="button"
                  onClick={() => setSignIn({ credential: 'demo@queenbees.zm', password: 'demo1234' })}
                  className="font-sans text-xs w-full text-center transition-colors hover:text-[var(--gold)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Just browsing? Use demo account
                </button>
              </form>
            )}

            {/* Create Account */}
            {authTab === 'create' && (
              <form onSubmit={handleCreate} className="space-y-4">
                <input style={INPUT_STYLE} placeholder="Full Name" value={create.name} onChange={e => setCreate(p => ({ ...p, name: e.target.value }))} required />
                <input style={INPUT_STYLE} placeholder="Phone Number" value={create.phone} onChange={e => setCreate(p => ({ ...p, phone: e.target.value }))} required />
                <input style={INPUT_STYLE} type="email" placeholder="Email Address" value={create.email} onChange={e => setCreate(p => ({ ...p, email: e.target.value }))} required />
                <input style={INPUT_STYLE} type="password" placeholder="Password" value={create.password} onChange={e => setCreate(p => ({ ...p, password: e.target.value }))} required />
                <input style={INPUT_STYLE} type="password" placeholder="Confirm Password" value={create.confirm} onChange={e => setCreate(p => ({ ...p, confirm: e.target.value }))} required />
                {createErr && <p className="font-sans text-xs" style={{ color: '#e57373' }}>{createErr}</p>}
                <button type="submit" className="btn-primary w-full mt-2">CREATE ACCOUNT →</button>
              </form>
            )}
          </div>
        </div>
      </main>
    )
  }

  /* ════════════════════════════════════════════════
     LOGGED IN — Dashboard
  ════════════════════════════════════════════════ */
  const DASH_TABS: { id: DashTab; label: string; Icon: React.ElementType }[] = [
    { id: 'overview', label: 'OVERVIEW', Icon: User },
    { id: 'orders', label: 'ORDERS', Icon: Package },
    { id: 'hive', label: 'HIVE CARD', Icon: CreditCard },
    { id: 'addresses', label: 'ADDRESSES', Icon: MapPin },
    { id: 'profile', label: 'PROFILE', Icon: Settings },
  ]

  return (
    <main style={{ background: 'var(--black)' }} className="min-h-screen pt-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10">

        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                WELCOME BACK
              </p>
              <h1 className="font-serif leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
                  {user.name.split(' ').slice(1).join(' ')}
                </em>
              </h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 btn-outline text-xs py-2 px-5 self-start"
            >
              <LogOut size={13} /> SIGN OUT
            </button>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <div className="border-b mb-10 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          <div className="flex min-w-max">
            {DASH_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setDashTab(id)}
                className="flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase py-4 px-5 whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  color: dashTab === id ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottomColor: dashTab === id ? 'var(--gold)' : 'transparent',
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {dashTab === 'overview' && (
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Total Orders', value: String(orders.length) },
                { label: 'Hive Points', value: `${user.hivePoints} pts` },
                { label: 'Member Since', value: formatDate(user.createdAt) },
              ].map(s => (
                <div key={s.label} className="p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="font-serif text-3xl" style={{ color: 'var(--gold)' }}>{s.value}</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Recent <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Orders</em>
            </h3>

            {orders.length === 0 ? (
              <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                No orders yet.{' '}
                <Link href="/menu" style={{ color: 'var(--gold)' }} className="underline">
                  Browse the menu →
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {[...orders].reverse().slice(0, 3).map(o => (
                  <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <div>
                      <p className="font-sans text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{o.id}</p>
                      <p className="font-sans text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
                        {o.items.map(i => i.name).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="font-sans text-xs px-2 py-1"
                        style={{
                          background: `${STATUS_COLORS[o.status]}20`,
                          color: STATUS_COLORS[o.status],
                          border: `1px solid ${STATUS_COLORS[o.status]}40`,
                        }}
                      >
                        {getStatusLabel(o.status)}
                      </span>
                      <span className="font-serif" style={{ color: 'var(--gold)' }}>K{o.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ── ORDERS ── */}
        {dashTab === 'orders' && (
          <ScrollReveal>
            {orders.length === 0 ? (
              <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {[...orders].reverse().map(o => (
                  <div key={o.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left"
                    >
                      <div>
                        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{o.id}</p>
                        <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className="font-sans text-xs px-2 py-1"
                          style={{
                            background: `${STATUS_COLORS[o.status]}20`,
                            color: STATUS_COLORS[o.status],
                          }}
                        >
                          {getStatusLabel(o.status)}
                        </span>
                        <span className="font-serif" style={{ color: 'var(--gold)' }}>K{o.total}</span>
                        {expandedOrder === o.id
                          ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} />
                          : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    </button>

                    {expandedOrder === o.id && (
                      <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="pt-4 space-y-2 mb-5">
                          {o.items.map(item => (
                            <div key={item.id} className="flex justify-between">
                              <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>
                                K{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Link
                          href={`/tracking?ref=${o.id}`}
                          className="inline-block btn-outline text-xs py-2 px-5"
                        >
                          TRACK ORDER →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ── HIVE CARD ── */}
        {dashTab === 'hive' && (
          <ScrollReveal>
            <div className="max-w-md">
              {/* Card */}
              <div
                className="relative p-8 mb-8 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1a1200 0%, #2d1e00 60%, #0d0900 100%)',
                  border: '1px solid var(--gold)',
                  boxShadow: '0 0 50px rgba(201,168,76,0.12)',
                }}
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="font-serif text-xl block" style={{ color: 'var(--gold)' }}>QUEEN BEES</span>
                    <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(201,168,76,0.55)' }}>
                      THE HIVE CARD
                    </span>
                  </div>
                  <span className="text-3xl">🐝</span>
                </div>
                <p className="font-serif text-5xl mb-1" style={{ color: 'var(--gold)' }}>{user.hivePoints}</p>
                <p className="font-sans text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(201,168,76,0.55)' }}>
                  HIVE POINTS
                </p>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{user.name}</p>
                {/* Decorative circle */}
                <div
                  className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full"
                  style={{ border: '1px solid rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.04)' }}
                />
              </div>

              {/* Tier progress */}
              <div className="p-6 mb-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between mb-3">
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                    YOUR TIER
                  </span>
                  <span className="font-sans text-sm font-semibold" style={{ color: tierColor(user.hivePoints) }}>
                    {tierLabel(user.hivePoints)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${tierProgress(user.hivePoints)}%`, background: tierColor(user.hivePoints) }}
                  />
                </div>
                {nextTier(user.hivePoints) !== null && (
                  <p className="font-sans text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    {nextTier(user.hivePoints)! - user.hivePoints} pts to {tierLabel(nextTier(user.hivePoints)!)}
                  </p>
                )}
              </div>

              {/* Rewards */}
              <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>REWARDS</p>
              <div className="space-y-3">
                {[
                  { pts: 100, reward: 'K20 discount on next order' },
                  { pts: 250, reward: 'Free vegetable side of your choice' },
                  { pts: 500, reward: 'Free main dish of your choice' },
                ].map(r => {
                  const unlocked = user.hivePoints >= r.pts
                  return (
                    <div
                      key={r.pts}
                      className="flex items-center justify-between p-4"
                      style={{
                        background: 'var(--card-bg)',
                        border: `1px solid ${unlocked ? 'var(--gold)' : 'var(--border)'}`,
                      }}
                    >
                      <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>{r.reward}</span>
                      <span
                        className="font-sans text-xs px-2 py-1 ml-4 flex-shrink-0"
                        style={{
                          background: unlocked ? 'rgba(201,168,76,0.15)' : 'transparent',
                          color: unlocked ? 'var(--gold)' : 'var(--text-muted)',
                          border: '1px solid currentColor',
                        }}
                      >
                        {r.pts} pts
                      </span>
                    </div>
                  )
                })}
              </div>

              <p className="font-sans text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
                1 Hive Point per K1 spent · Bonus 5 pts on orders ≥ K200
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* ── ADDRESSES ── */}
        {dashTab === 'addresses' && (
          <ScrollReveal>
            <div className="space-y-4 mb-6">
              {(user.addresses ?? []).length === 0 && (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No saved addresses.</p>
              )}
              {(user.addresses ?? []).map(addr => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between p-5"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                >
                  <div>
                    <span
                      className="font-sans text-xs px-2 py-0.5 mb-2 inline-block"
                      style={{
                        background: 'rgba(201,168,76,0.1)',
                        color: 'var(--gold)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {addr.label}
                    </span>
                    <p className="font-sans text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                      {addr.street}{addr.area ? `, ${addr.area}` : ''}, {addr.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="font-sans text-xs transition-colors hover:text-red-400 ml-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {!showAddAddr ? (
              <button
                onClick={() => setShowAddAddr(true)}
                className="btn-outline flex items-center gap-2 text-xs py-3 px-6"
              >
                <Plus size={13} /> ADD NEW ADDRESS
              </button>
            ) : (
              <div className="p-6 space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <select
                  style={{ ...INPUT_STYLE, appearance: 'none' }}
                  value={newAddr.label}
                  onChange={e => setNewAddr(p => ({ ...p, label: e.target.value as Address['label'] }))}
                >
                  {(['Home', 'Work', 'Other'] as Address['label'][]).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <input
                  style={INPUT_STYLE}
                  placeholder="Street address"
                  value={newAddr.street}
                  onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))}
                />
                <input
                  style={INPUT_STYLE}
                  placeholder="Area / Township"
                  value={newAddr.area}
                  onChange={e => setNewAddr(p => ({ ...p, area: e.target.value }))}
                />
                <div className="flex gap-3">
                  <button onClick={handleAddAddress} className="btn-primary text-xs py-3 px-6">SAVE ADDRESS</button>
                  <button onClick={() => setShowAddAddr(false)} className="btn-outline text-xs py-3 px-6">CANCEL</button>
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ── PROFILE ── */}
        {dashTab === 'profile' && (
          <ScrollReveal>
            <div className="max-w-md space-y-5">
              <input
                style={INPUT_STYLE}
                placeholder="Full Name"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              />
              <input
                style={INPUT_STYLE}
                placeholder="Phone Number"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              />
              <input
                style={INPUT_STYLE}
                type="email"
                placeholder="Email Address"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              />
              {profileSaved && (
                <p className="font-sans text-sm" style={{ color: 'var(--gold)' }}>✓ Changes saved</p>
              )}
              <button onClick={handleSaveProfile} className="btn-primary">SAVE CHANGES →</button>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={logout}
                  className="btn-outline flex items-center gap-2 text-xs py-3 px-6"
                >
                  <LogOut size={13} /> SIGN OUT
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </main>
  )
}
