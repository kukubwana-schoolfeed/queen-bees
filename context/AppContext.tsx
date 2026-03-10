'use client'
import { ReactNode } from 'react'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
