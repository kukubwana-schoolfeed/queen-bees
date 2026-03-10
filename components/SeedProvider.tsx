'use client'
import { useEffect } from 'react'
import { seedIfEmpty } from '@/lib/seedData'

export default function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedIfEmpty()
  }, [])
  return <>{children}</>
}
