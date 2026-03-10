'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/types'
import { storage } from '@/lib/storage'

interface AuthContextType {
  user: User | null
  login: (emailOrPhone: string, password: string) => boolean
  register: (data: Omit<User, 'id' | 'addresses' | 'hivePoints' | 'createdAt'>) => boolean
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(storage.getUser())
  }, [])

  const login = (emailOrPhone: string, password: string): boolean => {
    const users = storage.getUsers()
    const found = users.find(u =>
      (u.email === emailOrPhone || u.phone === emailOrPhone) &&
      u.password === btoa(password)
    )
    if (found) {
      storage.setUser(found)
      setUser(found)
      return true
    }
    return false
  }

  const register = (data: Omit<User, 'id' | 'addresses' | 'hivePoints' | 'createdAt'>): boolean => {
    const users = storage.getUsers()
    if (users.find(u => u.email === data.email)) return false
    const newUser: User = {
      ...data,
      id: 'u-' + Date.now(),
      password: btoa(data.password),
      addresses: [],
      hivePoints: 0,
      createdAt: new Date().toISOString(),
    }
    storage.setUsers([...users, newUser])
    storage.setUser(newUser)
    setUser(newUser)
    return true
  }

  const logout = () => {
    storage.clearUser()
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    storage.setUser(updated)
    setUser(updated)
    const users = storage.getUsers()
    storage.setUsers(users.map(u => u.id === updated.id ? updated : u))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
