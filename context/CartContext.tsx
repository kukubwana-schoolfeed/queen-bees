'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem } from '@/lib/types'
import { storage } from '@/lib/storage'

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setItems(storage.getCart())
  }, [])

  const save = (next: CartItem[]) => {
    setItems(next)
    storage.setCart(next)
  }

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const next = [...items]
    const idx = next.findIndex(i => i.id === item.id)
    if (idx >= 0) {
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
    } else {
      next.push({ ...item, quantity: 1 })
    }
    save(next)
  }

  const removeItem = (id: string) => save(items.filter(i => i.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id)
    save(items.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => {
    setItems([])
    storage.clearCart()
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
