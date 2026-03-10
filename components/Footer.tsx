import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--black-soft)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 */}
        <div>
          <div className="mb-4">
            <span className="font-serif text-2xl block" style={{ color: 'var(--gold)' }}>QUEEN BEES</span>
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-muted)' }}>RESTAURANT</span>
          </div>
          <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            Authentic Zambian cuisine served with elegance at two iconic Lusaka locations.
          </p>
          <p className="font-sans text-sm" style={{ color: 'var(--gold)' }}>+260 972 323 218</p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--gold)' }}>EXPLORE</h4>
          <ul className="space-y-3">
            {[['Our Menu', '/menu'], ['Reservations', '/reserve'], ['Track My Order', '/tracking'], ['Our Story', '/about'], ['Contact Us', '/contact']].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="font-sans text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--gold)' }}>LOCATIONS</h4>
          <ul className="space-y-3">
            {[['Longacres Mall', '/contact'], ['KKIA Airport', '/contact'], ['Opening Hours', '/contact'], ['Find Us', '/contact']].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="font-sans text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--gold)' }}>ACCOUNT</h4>
          <ul className="space-y-3">
            {[['My Account', '/account'], ['The Hive Card', '/account'], ['Order History', '/account'], ['Staff Login', '/admin']].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="font-sans text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: 'var(--border)' }}>
        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2025 Queen Bees Restaurant, Lusaka, Zambia. All rights reserved.
        </p>
        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
          Crafted with ♥ for Zambia
        </p>
      </div>
    </footer>
  )
}
