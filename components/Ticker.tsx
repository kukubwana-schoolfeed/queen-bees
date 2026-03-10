'use client'

const items = [
  'VILLAGE CHICKEN', 'GOAT MEAT', 'PORK TROTTERS', 'BUFFALO',
  'CHIBWABWA', 'IFISASHI', 'BONDWE', 'BREAM', 'OKRA FISH',
  'TRACK MY ORDER', 'ORDER RECEIVED', 'OUT FOR DELIVERY',
]

export default function Ticker() {
  const repeated = [...items, ...items]
  return (
    <div className="w-full overflow-hidden py-3" style={{ background: 'var(--gold)' }}>
      <div className="ticker-track">
        {repeated.map((item, i) => (
          <span key={i} className="font-sans font-semibold text-black text-xs tracking-[0.2em] uppercase whitespace-nowrap px-4">
            {item} <span className="mx-2">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
