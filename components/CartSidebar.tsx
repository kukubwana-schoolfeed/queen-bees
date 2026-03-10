'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface Props {
  onCheckout: () => void
}

export default function CartSidebar({ onCheckout }: Props) {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-sm md:max-w-md"
            style={{ background: 'var(--black-soft)', borderLeft: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} style={{ color: 'var(--gold)' }} />
                <h2 className="font-serif text-xl" style={{ color: 'var(--text-primary)' }}>
                  Your Order
                </h2>
                {count > 0 && (
                  <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gold)', color: '#000' }}>
                    {count}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--gold)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag size={48} style={{ color: 'var(--border)' }} />
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-outline text-xs py-3 px-6"
                  >
                    BROWSE MENU
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      {item.image && (
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden" style={{ borderRadius: '2px' }}>
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="font-serif text-sm" style={{ color: 'var(--gold)' }}>K{item.price} ZMW</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans text-sm w-4 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center ml-1 transition-colors hover:text-red-400"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span className="font-serif text-2xl" style={{ color: 'var(--gold)' }}>K{total} ZMW</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); onCheckout() }}
                  className="btn-primary w-full text-center"
                >
                  PROCEED TO PAYMENT →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
