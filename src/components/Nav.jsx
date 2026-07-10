const links = [
  { label: 'about', href: '#about', port: '3000' },
  { label: 'experience', href: '#experience', port: '3001' },
  { label: 'projects', href: '#projects', port: '3002' },
  { label: 'skills', href: '#skills', port: '3003' },
  { label: 'contact', href: '#contact', port: '3004' },
]

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-ink/90 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#top" className="font-mono text-sm text-text tracking-tight">
          <span className="text-signal">$</span> raffi.darrell
        </a>
        <ul className="hidden md:flex items-center gap-1 font-mono text-xs">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group flex items-center gap-2 px-3 py-1.5 rounded hover:bg-surface transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-route/60 group-hover:bg-route transition-colors" />
                <span className="text-muted group-hover:text-text transition-colors">/{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://wa.me/6285776616362"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs px-3 py-1.5 rounded border border-signal/40 text-signal hover:bg-signal hover:text-ink transition-colors"
        >
          connect →
        </a>
      </nav>
    </header>
  )
}
