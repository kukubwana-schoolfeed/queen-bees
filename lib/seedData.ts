import { MenuItem, Order, User } from './types'
import { storage } from './storage'

export const MENU_SEED: MenuItem[] = [
  { id: 'm1', category: 'main', name: 'Bream with 4 Vegetable Sides', price: 285, tags: ['NSHIMA', '4 SIDES', 'TOMATO SAUCE'], badge: 'SIGNATURE', description: 'Whole Kariba bream in a rich tomato and onion sauce, served with your choice of four traditional vegetable sides and hand-formed nshima.', image: '/images/bream.png' },
  { id: 'm2', category: 'main', name: 'Okra Fish with 3 Vegetable Sides', price: 260, tags: ['NSHIMA', '3 SIDES', 'OKRA SAUCE'], badge: 'TRADITIONAL', description: 'Tender fish cooked in a vibrant okra and tomato sauce, topped with fresh okra rounds, served with three vegetable sides and nshima.', image: '/images/okra-fish.png' },
  { id: 'm3', category: 'main', name: 'Village Chicken with 3 Sides', price: 295, tags: ['NSHIMA', '3 SIDES', 'FREE-RANGE'], badge: 'FAN FAVOURITE', description: 'Authentic free-range village chicken slow-braised in a spiced tomato sauce until fall-off-the-bone tender.', image: '/images/village-chicken.png' },
  { id: 'm4', category: 'main', name: 'Goat Meat with 4 Sides', price: 350, tags: ['NSHIMA', '4 SIDES', 'SLOW BRAISED'], badge: '', description: 'Slow-braised Zambian goat in a deep, richly spiced tomato sauce. Served with four traditional vegetable sides and nshima.', image: '/images/goat-meat.png' },
  { id: 'm5', category: 'main', name: 'Pork Trotters with 4 Sides', price: 310, tags: ['NSHIMA', '4 SIDES', 'SLOW SIMMERED'], badge: '', description: 'Tender pork trotters slow-simmered in a spiced tomato broth until gloriously soft.', image: '/images/pork-trotters.png' },
  { id: 'm6', category: 'main', name: 'Buffalo with 3 Sides', price: 406, tags: ['NSHIMA', '3 SIDES', 'RARE GAME'], badge: '', description: 'A rare and extraordinary offering. Tender buffalo slow-cooked in a deep, aromatic Zambian sauce.', image: '/images/photo-1.png' },
  { id: 'v1', category: 'sides', name: 'Chibwabwa', price: 35, tags: ['PUMPKIN LEAVES'], badge: '', description: 'Pumpkin leaves cooked in groundnut powder — the quintessential Zambian side.' },
  { id: 'v2', category: 'sides', name: 'Ifisashi', price: 35, tags: ['GROUNDNUT SAUCE'], badge: '', description: 'Leafy greens slow-cooked in a creamy groundnut sauce.' },
  { id: 'v3', category: 'sides', name: 'Kalembula', price: 35, tags: ['SWEET POTATO LEAVES'], badge: '', description: 'Sweet potato leaves sautéed with onion, tomato and spices.' },
  { id: 'v4', category: 'sides', name: 'Bondwe', price: 35, tags: ['WILD SPINACH'], badge: '', description: 'Wild African spinach cooked simply with garlic and tomato.' },
  { id: 'v5', category: 'sides', name: 'Delele', price: 35, tags: ['OKRA'], badge: '', description: 'Tender okra cooked in a light tomato and onion broth.' },
  { id: 'v6', category: 'sides', name: 'Impwa', price: 35, tags: ['AFRICAN EGGPLANT'], badge: '', description: 'African eggplant cooked with tomatoes and spices.' },
  { id: 'v7', category: 'sides', name: 'Katapa', price: 35, tags: ['CASSAVA LEAVES'], badge: '', description: 'Cassava leaves pounded and cooked with groundnuts.' },
  { id: 'v8', category: 'sides', name: 'Nshima', price: 25, tags: ['MAIZE'], badge: '', description: 'Hand-formed nshima from white maize. The foundation of every Zambian meal.' },
  { id: 'd1', category: 'drinks', name: 'Maheu', price: 25, tags: ['TRADITIONAL'], badge: '', description: 'Traditional fermented maize drink, lightly sweet.' },
  { id: 'd2', category: 'drinks', name: 'Hibiscus Juice', price: 30, tags: ['FRESH'], badge: '', description: 'Fresh hibiscus flower juice, chilled.' },
  { id: 'd3', category: 'drinks', name: 'Tamarind Drink', price: 30, tags: ['FRESH'], badge: '', description: 'Natural tamarind drink, sweet and tangy.' },
  { id: 'd4', category: 'drinks', name: 'Still Water', price: 15, tags: [], badge: '', description: '500ml bottled still water.' },
  { id: 'd5', category: 'drinks', name: 'Sparkling Water', price: 20, tags: [], badge: '', description: '500ml sparkling water.' },
  { id: 'd6', category: 'drinks', name: 'Zambian Ginger Beer', price: 35, tags: ['LOCAL'], badge: '', description: 'Locally brewed ginger beer.' },
]

export const DEMO_ORDERS: Order[] = [
  { id: 'QB-482910', userId: 'demo', items: [{ id: 'm1', name: 'Bream with 4 Vegetable Sides', price: 285, quantity: 1 }], total: 285, type: 'takeaway', status: 'received', location: 'longacres', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), updatedAt: new Date().toISOString(), paymentMethod: 'airtel', paymentRef: 'AR-291047' },
  { id: 'QB-391047', userId: 'demo', items: [{ id: 'm4', name: 'Goat Meat with 4 Sides', price: 350, quantity: 1 }, { id: 'd1', name: 'Maheu', price: 25, quantity: 2 }], total: 400, type: 'delivery', status: 'preparing', address: 'Plot 45, Roma Township, Lusaka', location: 'longacres', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), updatedAt: new Date().toISOString(), paymentMethod: 'mtn', paymentRef: 'MTN-847291' },
  { id: 'QB-558821', userId: 'demo', items: [{ id: 'm3', name: 'Village Chicken with 3 Sides', price: 295, quantity: 2 }], total: 590, type: 'takeaway', status: 'ready', location: 'kkia', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), updatedAt: new Date().toISOString(), paymentMethod: 'zamtel', paymentRef: 'ZT-558821' },
  { id: 'QB-203765', userId: 'demo', items: [{ id: 'm5', name: 'Pork Trotters with 4 Sides', price: 310, quantity: 1 }, { id: 'v2', name: 'Ifisashi', price: 35, quantity: 2 }], total: 380, type: 'delivery', status: 'delivered', address: 'House 12, Kabulonga, Lusaka', location: 'longacres', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), updatedAt: new Date().toISOString(), paymentMethod: 'airtel', paymentRef: 'AR-203765' },
]

export const DEMO_USER: User = {
  id: 'demo',
  name: 'Demo User',
  email: 'demo@queenbees.zm',
  phone: '+260 972 323 218',
  password: btoa('demo1234'),
  addresses: [{ id: 'a1', label: 'Home', street: 'Plot 45, Roma Township', area: 'Roma', city: 'Lusaka' }],
  hivePoints: 1255,
  createdAt: '2024-01-01T00:00:00.000Z',
}

export const ADMIN_USER: User = {
  id: 'admin',
  name: 'Admin',
  email: 'admin@queenbees.zm',
  phone: '+260 972 000 000',
  password: btoa('admin2025'),
  addresses: [],
  hivePoints: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
}

export function seedIfEmpty() {
  if (!storage.isSeeded()) {
    storage.setMenu(MENU_SEED)
    storage.setOrders(DEMO_ORDERS)
    const existingUsers = storage.getUsers()
    if (existingUsers.length === 0) {
      storage.setUsers([DEMO_USER, ADMIN_USER])
    }
  }
}
