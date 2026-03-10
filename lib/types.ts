export interface Address {
  id: string
  label: 'Home' | 'Work' | 'Other'
  street: string
  area: string
  city: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
  addresses: Address[]
  hivePoints: number
  createdAt: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface MenuItem {
  id: string
  category: 'main' | 'sides' | 'drinks'
  name: string
  price: number
  description: string
  tags: string[]
  badge: string
  image?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  type: 'delivery' | 'takeaway'
  status: 'received' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered'
  address?: string
  location: 'longacres' | 'kkia'
  createdAt: string
  updatedAt: string
  paymentMethod: 'airtel' | 'mtn' | 'zamtel'
  paymentRef: string
}

export interface Reservation {
  id: string
  userId?: string
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  location: 'longacres' | 'kkia'
  occasion?: string
  specialRequests?: string
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface Campaign {
  id: string
  name: string
  target: 'all' | 'hive' | 'inactive'
  channel: 'whatsapp' | 'sms' | 'email'
  message: string
  sentCount: number
  date: string
}
