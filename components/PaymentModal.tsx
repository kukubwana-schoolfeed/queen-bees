'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { storage } from '@/lib/storage'
import { generateOrderId, generatePaymentRef } from '@/lib/utils'
import { fireGoldConfetti, fireHiveConfetti } from '@/lib/confetti'
import Link from 'next/link'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Step = 'summary' | 'payment' | 'processing' | 'success'

export default function PaymentModal({ isOpen, onClose }: Props) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('summary')
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('takeaway')
  const [location, setLocation] = useState<'longacres' | 'kkia'>('longacres')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'mtn' | 'zamtel' | null>(null)
  const [phone, setPhone] = useState('')
  const [orderId, setOrderId] = useState('')
  const deliveryFee = orderType === 'delivery' ? 30 : 0
  const grandTotal = total + deliveryFee

  const handleProceed = () => setStep('payment')

  const handlePayment = async () => {
    if (!paymentMethod) return
    setStep('processing')
    await new Promise(r => setTimeout(r, 2500))

    const id = generateOrderId()
    setOrderId(id)

    const order = {
      id,
      userId: user?.id ?? 'guest',
      items: items.map(i => ({ ...i })),
      total: grandTotal,
      type: orderType,
      status: 'received' as const,
      address: orderType === 'delivery' ? address : undefined,
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod,
      paymentRef: generatePaymentRef(paymentMethod),
    }
    storage.addOrder(order)

    // Hive points
    if (user) {
      const points = grandTotal + (grandTotal >= 200 ? 5 : 0)
      const updated = { ...user, hivePoints: user.hivePoints + points }
      storage.setUser(updated)
      const users = storage.getUsers()
      storage.setUsers(users.map(u => u.id === updated.id ? updated : u))
    }

    clearCart()
    setStep('success')

    if (grandTotal >= 200) {
      await fireHiveConfetti()
    } else {
      await fireGoldConfetti()
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('summary')
      setPaymentMethod(null)
      setPhone('')
      setAddress('')
    }, 300)
  }

  const paymentOptions = [
    { id: 'airtel' as const, label: 'Airtel Money', color: '#E40000', desc: 'Pay with Airtel Money' },
    { id: 'mtn' as const, label: 'MTN MoMo', color: '#FFCC00', desc: 'Pay with MTN Mobile Money' },
    { id: 'zamtel' as const, label: 'Zamtel Kwacha', color: '#0050A0', desc: 'Pay with Zamtel Kwacha' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            style={{ background: 'var(--black-soft)', border: '1px solid var(--border)', borderRadius: '2px' }}
          >
            {step !== 'processing' && step !== 'success' && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            )}

            {/* STEP 1: Summary */}
            {step === 'summary' && (
              <div className="p-6 md:p-8">
                <h2 className="font-serif text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
                  Order <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Summary</em>
                </h2>
                <div className="space-y-3 mb-6 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
                  {items.map(item => (
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

                {/* Order type */}
                <div className="mb-5">
                  <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Order Type</p>
                  <div className="flex gap-3">
                    {(['takeaway', 'delivery'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setOrderType(t)}
                        className="flex-1 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-200"
                        style={{
                          border: `1px solid ${orderType === t ? 'var(--gold)' : 'var(--border)'}`,
                          color: orderType === t ? 'var(--gold)' : 'var(--text-muted)',
                          background: orderType === t ? 'rgba(201,168,76,0.08)' : 'transparent',
                          boxShadow: orderType === t ? '0 0 20px rgba(201,168,76,0.2)' : 'none',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="mb-5">
                    <input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Delivery address..."
                      className="w-full px-4 py-3 font-sans text-sm"
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}

                {/* Location */}
                <div className="mb-6">
                  <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Location</p>
                  <div className="flex gap-3">
                    {([['longacres', 'Longacres Mall'], ['kkia', 'KKIA Airport']] as const).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setLocation(id)}
                        className="flex-1 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-200"
                        style={{
                          border: `1px solid ${location === id ? 'var(--gold)' : 'var(--border)'}`,
                          color: location === id ? 'var(--gold)' : 'var(--text-muted)',
                          background: location === id ? 'rgba(201,168,76,0.08)' : 'transparent',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between">
                    <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                    <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>K{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Delivery fee</span>
                    <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>{deliveryFee === 0 ? 'Free' : `K${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-sans text-sm uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="font-serif text-2xl" style={{ color: 'var(--gold)' }}>K{grandTotal} ZMW</span>
                  </div>
                </div>

                <button onClick={handleProceed} className="btn-primary w-full">
                  CONTINUE TO PAYMENT →
                </button>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <div className="p-6 md:p-8">
                <button onClick={() => setStep('summary')} className="font-sans text-xs tracking-widest uppercase mb-6 flex items-center gap-2 transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-muted)' }}>
                  ← BACK
                </button>
                <h2 className="font-serif text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Choose <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Payment</em>
                </h2>
                <p className="font-sans text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Total: <span style={{ color: 'var(--gold)' }}>K{grandTotal} ZMW</span>
                </p>
                <div className="space-y-4 mb-6">
                  {paymentOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className="w-full p-4 flex items-center gap-4 text-left transition-all duration-200"
                      style={{
                        border: `1px solid ${paymentMethod === opt.id ? opt.color : 'var(--border)'}`,
                        background: paymentMethod === opt.id ? `${opt.color}15` : 'var(--card-bg)',
                        boxShadow: paymentMethod === opt.id ? `0 0 20px ${opt.color}30` : 'none',
                      }}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: opt.color }} />
                      <div>
                        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {paymentMethod && (
                  <div className="mb-6">
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+260 9X XXX XXXX"
                      className="w-full px-4 py-3 font-sans text-sm"
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={!paymentMethod || !phone}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  SEND PAYMENT REQUEST →
                </button>
              </div>
            )}

            {/* STEP 3: Processing */}
            {step === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center min-h-[300px] gap-6">
                <div
                  className="w-16 h-16 border-4 rounded-full"
                  style={{
                    borderColor: 'var(--gold)',
                    borderTopColor: 'transparent',
                    animation: 'spinGold 0.8s linear infinite',
                  }}
                />
                <p className="font-sans text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  Sending payment request to {paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Zamtel Kwacha'}...
                </p>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === 'success' && (
              <div className="p-8 flex flex-col items-center text-center gap-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid var(--gold)' }}
                >
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                    <path
                      d="M12 26 L22 36 L38 18"
                      stroke="#C9A84C"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: 'drawCheck 0.6s ease forwards', strokeDasharray: 200, strokeDashoffset: 200 }}
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    Order <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Confirmed</em>
                  </h2>
                  <p className="font-sans text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Your order reference</p>
                  <p className="font-serif text-xl" style={{ color: 'var(--gold)' }}>{orderId}</p>
                </div>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your order is being prepared. We'll have it ready soon.
                </p>
                {grandTotal >= 200 && (
                  <p className="font-sans text-sm px-4 py-2" style={{ color: 'var(--gold)', border: '1px solid var(--border)', background: 'rgba(201,168,76,0.08)' }}>
                    🐝 You earned {grandTotal + 5} Hive Points on this order!
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                  <Link
                    href={`/tracking?ref=${orderId}`}
                    onClick={handleClose}
                    className="btn-primary flex-1 text-center"
                  >
                    TRACK MY ORDER
                  </Link>
                  <button onClick={handleClose} className="btn-outline flex-1">
                    BACK TO MENU
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
