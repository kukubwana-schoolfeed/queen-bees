import { User, Order, Reservation, CartItem, MenuItem } from './types'

const KEYS = {
  USER:         'qb_user',
  USERS:        'qb_users',
  ORDERS:       'qb_orders',
  RESERVATIONS: 'qb_reservations',
  CART:         'qb_cart',
  MENU:         'qb_menu',
  HIVE_POINTS:  'qb_hive_points',
  CAMPAIGNS:    'qb_campaigns',
} as const

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : null
  } catch { return null }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function remove(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

export const storage = {
  // User
  getUser: () => get<User>(KEYS.USER),
  setUser: (u: User) => set(KEYS.USER, u),
  clearUser: () => remove(KEYS.USER),

  getUsers: () => get<User[]>(KEYS.USERS) ?? [],
  setUsers: (users: User[]) => set(KEYS.USERS, users),

  // Orders
  getOrders: () => get<Order[]>(KEYS.ORDERS) ?? [],
  setOrders: (orders: Order[]) => set(KEYS.ORDERS, orders),
  addOrder: (order: Order) => {
    const orders = get<Order[]>(KEYS.ORDERS) ?? []
    set(KEYS.ORDERS, [...orders, order])
  },
  updateOrder: (id: string, updates: Partial<Order>) => {
    const orders = get<Order[]>(KEYS.ORDERS) ?? []
    set(KEYS.ORDERS, orders.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o))
  },

  // Reservations
  getReservations: () => get<Reservation[]>(KEYS.RESERVATIONS) ?? [],
  setReservations: (r: Reservation[]) => set(KEYS.RESERVATIONS, r),
  addReservation: (r: Reservation) => {
    const all = get<Reservation[]>(KEYS.RESERVATIONS) ?? []
    set(KEYS.RESERVATIONS, [...all, r])
  },
  updateReservation: (id: string, updates: Partial<Reservation>) => {
    const all = get<Reservation[]>(KEYS.RESERVATIONS) ?? []
    set(KEYS.RESERVATIONS, all.map(r => r.id === id ? { ...r, ...updates } : r))
  },

  // Cart
  getCart: () => get<CartItem[]>(KEYS.CART) ?? [],
  setCart: (items: CartItem[]) => set(KEYS.CART, items),
  clearCart: () => remove(KEYS.CART),

  // Menu
  getMenu: () => get<MenuItem[]>(KEYS.MENU) ?? [],
  setMenu: (items: MenuItem[]) => set(KEYS.MENU, items),

  // Campaigns
  getCampaigns: () => get<any[]>(KEYS.CAMPAIGNS) ?? [],
  setCampaigns: (c: any[]) => set(KEYS.CAMPAIGNS, c),

  isSeeded: () => {
    const menu = get<MenuItem[]>(KEYS.MENU)
    return Array.isArray(menu) && menu.length > 0
  },
}
