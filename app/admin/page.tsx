'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { Order, Reservation, MenuItem, User } from '@/lib/types'
import { formatDate, formatDateTime, getStatusLabel } from '@/lib/utils'
import { MENU_SEED } from '@/lib/seedData'
import {
  Package, UtensilsCrossed, CalendarCheck, Users, BarChart3,
  Megaphone, LogOut, Plus, Edit2, Trash2, Search, X,
} from 'lucide-react'

/* ─── Types ─────────────────────────────────────────── */
type AdminTab = 'orders' | 'menu' | 'reservations' | 'customers' | 'analytics' | 'outreach'
type StatusFilter = 'all' | 'active' | 'completed'

const STATUS_COLORS: Record<string, string> = {
  received: '#C9A84C', preparing: '#E2A500', ready: '#4CAF50',
  'out-for-delivery': '#2196F3', delivered: '#4CAF50',
  confirmed: '#4CAF50', cancelled: '#e57373', completed: '#888',
}

const INPUT_STYLE: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(201,168,76,0.2)',
  color: '#F5F0E8',
  padding: '10px 14px',
  fontFamily: 'var(--font-sans)',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
}

const BLANK_ITEM: Omit<MenuItem, 'id'> = {
  category: 'main', name: '', price: 0,
  description: '', tags: [], badge: '', image: '',
}

/* ─── Admin Panel ────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [creds, setCreds] = useState({ email: '', password: '' })
  const [authErr, setAuthErr] = useState('')
  const [tab, setTab] = useState<AdminTab>('orders')

  /* Data */
  const [orders, setOrders] = useState<Order[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [customers, setCustomers] = useState<User[]>([])

  /* Orders */
  const [orderFilter, setOrderFilter] = useState<StatusFilter>('all')
  const [orderSearch, setOrderSearch] = useState('')

  /* Menu modal */
  const [menuModal, setMenuModal] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [itemForm, setItemForm] = useState<Omit<MenuItem, 'id'>>(BLANK_ITEM)

  /* Reservations */
  const [resFilter, setResFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  /* Customers */
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  /* Outreach */
  const [campaign, setCampaign] = useState({
    name: '', target: 'all' as 'all' | 'hive' | 'inactive',
    channel: 'whatsapp' as 'whatsapp' | 'sms' | 'email',
    message: '',
  })
  const [campaignSent, setCampaignSent] = useState(false)
  const [pastCampaigns, setPastCampaigns] = useState<any[]>([])

  useEffect(() => {
    if (!authed) return
    setOrders(storage.getOrders())
    setMenu(storage.getMenu().length > 0 ? storage.getMenu() : MENU_SEED)
    setReservations(storage.getReservations())
    setCustomers(storage.getUsers())
    setPastCampaigns(storage.getCampaigns())
  }, [authed])

  /* ── LOGIN ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users = storage.getUsers()
    const admin = users.find(u =>
      u.email === creds.email && u.password === btoa(creds.password)
    )
    if (admin) { setAuthed(true); setAuthErr('') }
    else setAuthErr('Invalid credentials. Try admin@queenbees.zm / admin2025')
  }

  /* ── ORDER helpers ── */
  const updateOrderStatus = (id: string, status: Order['status']) => {
    storage.updateOrder(id, { status })
    setOrders(storage.getOrders())
  }

  const filteredOrders = orders.filter(o => {
    const matchFilter =
      orderFilter === 'all' ? true :
      orderFilter === 'active' ? !['delivered'].includes(o.status) :
      o.status === 'delivered'
    const matchSearch = !orderSearch || o.id.toLowerCase().includes(orderSearch.toLowerCase())
    return matchFilter && matchSearch
  })

  /* ── MENU helpers ── */
  const openAddItem = () => { setEditItem(null); setItemForm(BLANK_ITEM); setMenuModal(true) }
  const openEditItem = (item: MenuItem) => { setEditItem(item); setItemForm({ ...item }); setMenuModal(true) }
  const saveItem = () => {
    let next: MenuItem[]
    if (editItem) {
      next = menu.map(m => m.id === editItem.id ? { ...itemForm, id: editItem.id } : m)
    } else {
      next = [...menu, { ...itemForm, id: 'm' + Date.now() }]
    }
    setMenu(next)
    storage.setMenu(next)
    setMenuModal(false)
  }
  const deleteItem = (id: string) => {
    const next = menu.filter(m => m.id !== id)
    setMenu(next)
    storage.setMenu(next)
  }

  /* ── RESERVATION helpers ── */
  const updateRes = (id: string, status: Reservation['status']) => {
    storage.updateReservation(id, { status })
    setReservations(storage.getReservations())
  }

  const today = new Date().toISOString().split('T')[0]
  const filteredRes = reservations.filter(r => {
    if (resFilter === 'upcoming') return r.date >= today
    if (resFilter === 'past') return r.date < today
    return true
  })

  /* ── OUTREACH helpers ── */
  const targetCount = () => {
    if (campaign.target === 'all') return customers.length
    if (campaign.target === 'hive') return customers.filter(u => u.hivePoints > 0).length
    // inactive: no orders in last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    const activeIds = new Set(orders.filter(o => new Date(o.createdAt).getTime() > cutoff).map(o => o.userId))
    return customers.filter(u => !activeIds.has(u.id)).length
  }

  const launchCampaign = () => {
    const c = { ...campaign, id: 'c-' + Date.now(), sentCount: targetCount(), date: new Date().toISOString() }
    const next = [...pastCampaigns, c]
    setPastCampaigns(next)
    storage.setCampaigns(next)
    setCampaignSent(true)
    setTimeout(() => setCampaignSent(false), 3000)
    setCampaign({ name: '', target: 'all', channel: 'whatsapp', message: '' })
  }

  /* ── ANALYTICS ── */
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
  const avgOrder = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0
  const dishCounts: Record<string, number> = {}
  orders.forEach(o => o.items.forEach(i => { dishCounts[i.name] = (dishCounts[i.name] ?? 0) + i.quantity }))
  const topDishes = Object.entries(dishCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    return { day: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: orders.filter(o => o.createdAt.startsWith(ds)).length }
  })
  const maxCount = Math.max(...last7.map(d => d.count), 1)

  /* ════════════════ LOGIN SCREEN ════════════════ */
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="p-10" style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="text-center mb-8">
              <span className="font-serif text-2xl block" style={{ color: '#C9A84C' }}>QUEEN BEES</span>
              <span
                className="font-sans text-[10px] tracking-[0.25em] uppercase inline-block mt-2 px-3 py-1"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                STAFF ACCESS ONLY
              </span>
              <h2 className="font-serif text-2xl mt-5" style={{ color: '#F5F0E8' }}>
                Admin <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Panel</em>
              </h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input style={INPUT_STYLE} type="email" placeholder="sue@queenbees.zm" value={creds.email} onChange={e => setCreds(p => ({ ...p, email: e.target.value }))} required />
              <input style={INPUT_STYLE} type="password" placeholder="Password" value={creds.password} onChange={e => setCreds(p => ({ ...p, password: e.target.value }))} required />
              {authErr && <p className="font-sans text-xs" style={{ color: '#e57373' }}>{authErr}</p>}
              <button type="submit" className="btn-primary w-full mt-2">SIGN IN TO DASHBOARD →</button>
              <button
                type="button"
                onClick={() => setCreds({ email: 'admin@queenbees.zm', password: 'admin2025' })}
                className="font-sans text-xs w-full text-center transition-colors hover:text-[var(--gold)]"
                style={{ color: '#888' }}
              >
                Use demo credentials
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  /* ════════════════ DASHBOARD ════════════════ */
  const TABS: { id: AdminTab; label: string; Icon: React.ElementType }[] = [
    { id: 'orders', label: 'ORDERS', Icon: Package },
    { id: 'menu', label: 'MENU', Icon: UtensilsCrossed },
    { id: 'reservations', label: 'RESERVATIONS', Icon: CalendarCheck },
    { id: 'customers', label: 'CUSTOMERS', Icon: Users },
    { id: 'analytics', label: 'ANALYTICS', Icon: BarChart3 },
    { id: 'outreach', label: 'OUTREACH', Icon: Megaphone },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(10px)' }}
      >
        <span className="font-serif text-lg" style={{ color: '#C9A84C' }}>QUEEN BEES · ADMIN</span>
        <button
          onClick={() => setAuthed(false)}
          className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors hover:text-[var(--gold)]"
          style={{ color: '#888' }}
        >
          <LogOut size={13} /> SIGN OUT
        </button>
      </div>

      <div className="pt-14">
        {/* Tab nav */}
        <div className="overflow-x-auto border-b" style={{ borderColor: 'rgba(201,168,76,0.15)', background: '#111111' }}>
          <div className="flex min-w-max px-4">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase py-4 px-5 whitespace-nowrap border-b-2 transition-all duration-200"
                style={{
                  color: tab === id ? '#C9A84C' : '#888',
                  borderBottomColor: tab === id ? '#C9A84C' : 'transparent',
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">

          {/* ══════════ ORDERS TAB ══════════ */}
          {tab === 'orders' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                  {(['all', 'active', 'completed'] as StatusFilter[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all"
                      style={{
                        background: orderFilter === f ? '#C9A84C' : 'transparent',
                        color: orderFilter === f ? '#000' : '#888',
                        border: '1px solid rgba(201,168,76,0.3)',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-1 max-w-xs" style={{ border: '1px solid rgba(201,168,76,0.2)', padding: '8px 12px' }}>
                  <Search size={13} style={{ color: '#888' }} />
                  <input
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontFamily: 'var(--font-sans)', fontSize: '13px', width: '100%' }}
                    placeholder="Search by ref..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                      {['Ref', 'Items', 'Total', 'Location', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 font-sans text-[10px] tracking-widest uppercase" style={{ color: '#888' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#C9A84C' }}>{o.id}</td>
                        <td className="py-3 pr-4 font-sans text-xs max-w-[180px] truncate" style={{ color: '#888' }}>
                          {o.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                        </td>
                        <td className="py-3 pr-4 font-serif text-sm" style={{ color: '#F5F0E8' }}>K{o.total}</td>
                        <td className="py-3 pr-4 font-sans text-xs capitalize" style={{ color: '#888' }}>{o.location}</td>
                        <td className="py-3 pr-4 font-sans text-xs capitalize" style={{ color: '#888' }}>{o.type}</td>
                        <td className="py-3 pr-4">
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value as Order['status'])}
                            className="font-sans text-xs px-2 py-1"
                            style={{
                              background: `${STATUS_COLORS[o.status]}20`,
                              color: STATUS_COLORS[o.status],
                              border: `1px solid ${STATUS_COLORS[o.status]}40`,
                              outline: 'none',
                            }}
                          >
                            {['received', 'preparing', 'ready', 'out-for-delivery', 'delivered'].map(s => (
                              <option key={s} value={s} style={{ background: '#111', color: '#F5F0E8' }}>{getStatusLabel(s)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{formatDate(o.createdAt)}</td>
                        <td className="py-3" />
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={8} className="py-10 text-center font-sans text-sm" style={{ color: '#888' }}>No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ MENU TAB ══════════ */}
          {tab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: '#F5F0E8' }}>
                  Menu <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Items</em>
                </h2>
                <button onClick={openAddItem} className="btn-primary flex items-center gap-2 py-3 px-6 text-xs">
                  <Plus size={13} /> ADD ITEM
                </button>
              </div>

              {(['main', 'sides', 'drinks'] as const).map(cat => (
                <div key={cat} className="mb-10">
                  <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C' }}>
                    {cat === 'main' ? 'MAIN DISHES' : cat === 'sides' ? 'VEGETABLE SIDES' : 'DRINKS'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menu.filter(m => m.category === cat).map(item => (
                      <div key={item.id} className="p-4 flex flex-col gap-2" style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.15)' }}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
                            {item.badge && (
                              <span className="font-sans text-[9px] tracking-widest uppercase px-1.5 py-0.5 mt-1 inline-block" style={{ background: '#C9A84C', color: '#000' }}>{item.badge}</span>
                            )}
                          </div>
                          <span className="font-serif text-base ml-3 flex-shrink-0" style={{ color: '#C9A84C' }}>K{item.price}</span>
                        </div>
                        <p className="font-sans text-xs leading-relaxed" style={{ color: '#888' }}>{item.description}</p>
                        <div className="flex gap-2 mt-auto pt-2">
                          <button
                            onClick={() => openEditItem(item)}
                            className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 transition-all hover:text-[var(--gold)]"
                            style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#888' }}
                          >
                            <Edit2 size={11} /> Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 transition-all hover:text-red-400"
                            style={{ border: '1px solid rgba(255,100,100,0.2)', color: '#888' }}
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Menu modal */}
              {menuModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
                  <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8" style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl" style={{ color: '#F5F0E8' }}>
                        {editItem ? 'Edit' : 'Add'} <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Item</em>
                      </h3>
                      <button onClick={() => setMenuModal(false)} style={{ color: '#888' }}><X size={18} /></button>
                    </div>
                    <div className="space-y-4">
                      <input style={INPUT_STYLE} placeholder="Dish name" value={itemForm.name} onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))} />
                      <select style={{ ...INPUT_STYLE, appearance: 'none' }} value={itemForm.category} onChange={e => setItemForm(p => ({ ...p, category: e.target.value as MenuItem['category'] }))}>
                        <option value="main">Main Dish</option>
                        <option value="sides">Vegetable Side</option>
                        <option value="drinks">Drink</option>
                      </select>
                      <input style={INPUT_STYLE} type="number" placeholder="Price (ZMW)" value={itemForm.price || ''} onChange={e => setItemForm(p => ({ ...p, price: Number(e.target.value) }))} />
                      <textarea style={{ ...INPUT_STYLE, minHeight: '80px', resize: 'vertical' }} placeholder="Description" value={itemForm.description} onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))} />
                      <input style={INPUT_STYLE} placeholder="Tags (comma separated)" value={itemForm.tags.join(', ')} onChange={e => setItemForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
                      <input style={INPUT_STYLE} placeholder="Badge (SIGNATURE / TRADITIONAL / FAN FAVOURITE)" value={itemForm.badge} onChange={e => setItemForm(p => ({ ...p, badge: e.target.value }))} />
                      <input style={INPUT_STYLE} placeholder="Image path (e.g. /images/bream.png)" value={itemForm.image ?? ''} onChange={e => setItemForm(p => ({ ...p, image: e.target.value }))} />
                      <button onClick={saveItem} className="btn-primary w-full">SAVE ITEM</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════ RESERVATIONS TAB ══════════ */}
          {tab === 'reservations' && (
            <div>
              <div className="flex gap-2 mb-6">
                {(['all', 'upcoming', 'past'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setResFilter(f)}
                    className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all capitalize"
                    style={{
                      background: resFilter === f ? '#C9A84C' : 'transparent',
                      color: resFilter === f ? '#000' : '#888',
                      border: '1px solid rgba(201,168,76,0.3)',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                      {['Name', 'Phone', 'Date', 'Time', 'Guests', 'Location', 'Occasion', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 font-sans text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ color: '#888' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRes.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#F5F0E8' }}>{r.name}</td>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{r.phone}</td>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{r.date}</td>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{r.time}</td>
                        <td className="py-3 pr-4 font-sans text-xs text-center" style={{ color: '#888' }}>{r.guests}</td>
                        <td className="py-3 pr-4 font-sans text-xs capitalize" style={{ color: '#888' }}>{r.location}</td>
                        <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{r.occasion ?? '—'}</td>
                        <td className="py-3 pr-4">
                          <span className="font-sans text-xs px-2 py-1 capitalize" style={{ background: `${STATUS_COLORS[r.status]}20`, color: STATUS_COLORS[r.status], border: `1px solid ${STATUS_COLORS[r.status]}40` }}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {r.status !== 'confirmed' && (
                              <button onClick={() => updateRes(r.id, 'confirmed')} className="font-sans text-[10px] px-2 py-1 transition-colors hover:text-[var(--gold)]" style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#888' }}>Confirm</button>
                            )}
                            {r.status !== 'cancelled' && (
                              <button onClick={() => updateRes(r.id, 'cancelled')} className="font-sans text-[10px] px-2 py-1 transition-colors hover:text-red-400" style={{ border: '1px solid rgba(255,100,100,0.2)', color: '#888' }}>Cancel</button>
                            )}
                            {r.status !== 'completed' && (
                              <button onClick={() => updateRes(r.id, 'completed')} className="font-sans text-[10px] px-2 py-1 transition-colors hover:text-[var(--gold)]" style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#888' }}>Complete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRes.length === 0 && (
                      <tr><td colSpan={9} className="py-10 text-center font-sans text-sm" style={{ color: '#888' }}>No reservations found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ CUSTOMERS TAB ══════════ */}
          {tab === 'customers' && (
            <div>
              <div className="overflow-x-auto mb-4">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                      {['Name', 'Email', 'Phone', 'Orders', 'Hive Points', 'Joined', ''].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 font-sans text-[10px] tracking-widest uppercase" style={{ color: '#888' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => {
                      const userOrders = orders.filter(o => o.userId === c.id)
                      const expanded = expandedCustomer === c.id
                      return (
                        <>
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#F5F0E8' }}>{c.name}</td>
                            <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{c.email}</td>
                            <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{c.phone}</td>
                            <td className="py-3 pr-4 font-sans text-xs text-center" style={{ color: '#888' }}>{userOrders.length}</td>
                            <td className="py-3 pr-4 font-serif text-sm" style={{ color: '#C9A84C' }}>{c.hivePoints}</td>
                            <td className="py-3 pr-4 font-sans text-xs" style={{ color: '#888' }}>{formatDate(c.createdAt)}</td>
                            <td className="py-3">
                              <button
                                onClick={() => setExpandedCustomer(expanded ? null : c.id)}
                                className="font-sans text-[10px] px-3 py-1 transition-colors hover:text-[var(--gold)]"
                                style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#888' }}
                              >
                                {expanded ? 'HIDE' : 'DETAILS'}
                              </button>
                            </td>
                          </tr>
                          {expanded && (
                            <tr key={`${c.id}-exp`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td colSpan={7} className="py-4 px-4" style={{ background: '#161616' }}>
                                <p className="font-sans text-[10px] tracking-widest uppercase mb-3" style={{ color: '#C9A84C' }}>ORDER HISTORY</p>
                                {userOrders.length === 0 ? (
                                  <p className="font-sans text-xs" style={{ color: '#888' }}>No orders</p>
                                ) : (
                                  <div className="space-y-2">
                                    {userOrders.map(o => (
                                      <div key={o.id} className="flex justify-between items-center">
                                        <span className="font-sans text-xs" style={{ color: '#888' }}>{o.id} · {formatDate(o.createdAt)}</span>
                                        <span className="font-serif text-sm" style={{ color: '#C9A84C' }}>K{o.total}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ ANALYTICS TAB ══════════ */}
          {tab === 'analytics' && (
            <div>
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Total Revenue', value: `K${totalRevenue}` },
                  { label: 'Total Orders', value: String(orders.length) },
                  { label: 'Customers', value: String(customers.length) },
                  { label: 'Avg Order Value', value: `K${avgOrder}` },
                ].map(s => (
                  <div key={s.label} className="p-6" style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <p className="font-sans text-[10px] tracking-widest uppercase mb-2" style={{ color: '#888' }}>{s.label}</p>
                    <p className="font-serif text-3xl" style={{ color: '#C9A84C' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar chart */}
                <div className="p-6" style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <p className="font-sans text-[10px] tracking-widest uppercase mb-6" style={{ color: '#888' }}>ORDERS — LAST 7 DAYS</p>
                  <div className="flex items-end gap-3 h-40">
                    {last7.map(d => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-sans text-xs" style={{ color: '#C9A84C' }}>{d.count || ''}</span>
                        <div
                          className="w-full transition-all duration-700"
                          style={{
                            height: `${(d.count / maxCount) * 100}%`,
                            minHeight: d.count > 0 ? '8px' : '2px',
                            background: d.count > 0 ? '#C9A84C' : 'rgba(201,168,76,0.1)',
                          }}
                        />
                        <span className="font-sans text-[10px]" style={{ color: '#888' }}>{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top dishes */}
                <div className="p-6" style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <p className="font-sans text-[10px] tracking-widest uppercase mb-6" style={{ color: '#888' }}>TOP DISHES</p>
                  {topDishes.length === 0 ? (
                    <p className="font-sans text-sm" style={{ color: '#888' }}>No order data yet</p>
                  ) : (
                    <div className="space-y-4">
                      {topDishes.map(([name, count], i) => (
                        <div key={name} className="flex items-center gap-4">
                          <span className="font-serif text-xl w-6 flex-shrink-0" style={{ color: 'rgba(201,168,76,0.4)' }}>
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-sans text-xs" style={{ color: '#F5F0E8' }}>{name}</span>
                              <span className="font-sans text-xs" style={{ color: '#C9A84C' }}>{count}</span>
                            </div>
                            <div className="h-1 w-full" style={{ background: 'rgba(201,168,76,0.1)' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${(count / topDishes[0][1]) * 100}%`,
                                  background: '#C9A84C',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ OUTREACH TAB ══════════ */}
          {tab === 'outreach' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Campaign builder */}
              <div>
                <h2 className="font-serif text-2xl mb-8" style={{ color: '#F5F0E8' }}>
                  New <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Campaign</em>
                </h2>
                <div className="space-y-5">
                  <input
                    style={INPUT_STYLE}
                    placeholder="Campaign name"
                    value={campaign.name}
                    onChange={e => setCampaign(p => ({ ...p, name: e.target.value }))}
                  />

                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase mb-3" style={{ color: '#888' }}>TARGET</p>
                    <div className="space-y-2">
                      {([
                        ['all', 'All Customers'],
                        ['hive', 'Hive Card Members'],
                        ['inactive', 'Last Order > 30 Days'],
                      ] as const).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value={val}
                            checked={campaign.target === val}
                            onChange={() => setCampaign(p => ({ ...p, target: val }))}
                            style={{ accentColor: '#C9A84C' }}
                          />
                          <span className="font-sans text-sm" style={{ color: '#F5F0E8' }}>{label}</span>
                          <span className="font-sans text-xs ml-auto" style={{ color: '#C9A84C' }}>
                            {val === 'all' ? customers.length :
                             val === 'hive' ? customers.filter(u => u.hivePoints > 0).length :
                             targetCount()} customers
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase mb-3" style={{ color: '#888' }}>CHANNEL</p>
                    <div className="flex gap-3">
                      {([
                        ['whatsapp', '📱 WhatsApp'],
                        ['sms', '💬 SMS'],
                        ['email', '📧 Email'],
                      ] as const).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => setCampaign(p => ({ ...p, channel: val }))}
                          className="flex-1 py-2 font-sans text-xs transition-all"
                          style={{
                            border: `1px solid ${campaign.channel === val ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                            color: campaign.channel === val ? '#C9A84C' : '#888',
                            background: campaign.channel === val ? 'rgba(201,168,76,0.08)' : 'transparent',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="font-sans text-[10px] tracking-widest uppercase" style={{ color: '#888' }}>MESSAGE</p>
                      <span className="font-sans text-[10px]" style={{ color: '#888' }}>{campaign.message.length} chars</span>
                    </div>
                    <textarea
                      style={{ ...INPUT_STYLE, minHeight: '120px', resize: 'vertical' }}
                      placeholder="Type your message here..."
                      value={campaign.message}
                      onChange={e => setCampaign(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>

                  {campaignSent && (
                    <div className="px-4 py-3 font-sans text-sm" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>
                      ✓ Campaign queued for {targetCount()} customers
                    </div>
                  )}

                  <button
                    onClick={launchCampaign}
                    disabled={!campaign.name || !campaign.message}
                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    LAUNCH CAMPAIGN →
                  </button>
                </div>
              </div>

              {/* Preview + past campaigns */}
              <div>
                {campaign.message && (
                  <div className="mb-8">
                    <p className="font-sans text-[10px] tracking-widest uppercase mb-4" style={{ color: '#888' }}>PREVIEW</p>
                    <div className="p-5" style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px 8px 8px 0' }}>
                      <p className="font-sans text-xs mb-1 uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                        {campaign.channel === 'whatsapp' ? '📱 WhatsApp' : campaign.channel === 'sms' ? '💬 SMS' : '📧 Email'} · Queen Bees
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: '#F5F0E8' }}>{campaign.message}</p>
                    </div>
                    <p className="font-sans text-xs mt-2" style={{ color: '#888' }}>
                      Will be sent to {targetCount()} {campaign.target === 'all' ? 'customers' : campaign.target === 'hive' ? 'Hive Card members' : 'inactive customers'}
                    </p>
                  </div>
                )}

                <p className="font-sans text-[10px] tracking-widest uppercase mb-4" style={{ color: '#888' }}>PAST CAMPAIGNS</p>
                {pastCampaigns.length === 0 ? (
                  <p className="font-sans text-sm" style={{ color: '#888' }}>No campaigns launched yet.</p>
                ) : (
                  <div className="space-y-3">
                    {[...pastCampaigns].reverse().map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between p-4" style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.1)' }}>
                        <div>
                          <p className="font-sans text-sm font-semibold" style={{ color: '#F5F0E8' }}>{c.name}</p>
                          <p className="font-sans text-xs" style={{ color: '#888' }}>
                            {c.channel} · {c.target} · {formatDate(c.date)}
                          </p>
                        </div>
                        <span className="font-serif text-lg" style={{ color: '#C9A84C' }}>{c.sentCount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
