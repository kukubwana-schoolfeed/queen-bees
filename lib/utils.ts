export function generateOrderId(): string {
  return 'QB-' + Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateResId(): string {
  return 'RES-' + Math.floor(100000 + Math.random() * 900000).toString()
}

export function generatePaymentRef(method: string): string {
  const prefix = method === 'airtel' ? 'AR' : method === 'mtn' ? 'MTN' : 'ZT'
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`
}

export function formatPrice(amount: number): string {
  return `K${amount} ZMW`
}

export function formatPriceShort(amount: number): string {
  return `K${amount}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    received: 'Order Received',
    preparing: 'Preparing',
    ready: 'Ready for Collection',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
  }
  return map[status] ?? status
}

export function getStatusStep(status: string): number {
  const steps = ['received', 'preparing', 'ready', 'out-for-delivery', 'delivered']
  return steps.indexOf(status)
}
