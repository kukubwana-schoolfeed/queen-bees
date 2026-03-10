'use client'
import { storage } from './storage'

export async function fireGoldConfetti() {
  if (typeof window === 'undefined') return
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 120,
    spread: 80,
    colors: ['#C9A84C', '#E2C675', '#A8872A', '#FFD700', '#FFF8DC'],
    origin: { y: 0.6 },
  })
}

export async function fireHiveConfetti() {
  await fireGoldConfetti()
  if (typeof window === 'undefined') return
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('div')
    el.innerHTML = '🐝 +5 Hive Points'
    el.style.cssText = `
      position: fixed;
      left: ${30 + Math.random() * 40}%;
      bottom: 20%;
      color: #C9A84C;
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      pointer-events: auto;
      cursor: pointer;
      z-index: 9999;
      animation: floatUp 3s ease forwards;
      animation-delay: ${i * 0.3}s;
      opacity: 0;
    `
    el.addEventListener('click', () => {
      const user = storage.getUser()
      if (user) {
        user.hivePoints += 5
        storage.setUser(user)
        const users = storage.getUsers()
        storage.setUsers(users.map(u => u.id === user.id ? user : u))
      }
      el.remove()
    })
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000 + i * 300)
  }
}
