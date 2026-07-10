export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="font-mono text-xs text-route mb-3">POST /contact</div>
        <h2 className="font-mono font-bold text-2xl sm:text-3xl text-text mb-4">
          Let's build something.
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Open to internships, collaborations, or a quick chat about backend
          architecture, Android, or whatever you're building.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:raffi.darrell.f@gmail.com"
            className="font-mono text-sm px-5 py-2.5 rounded border border-signal text-signal hover:bg-signal hover:text-ink transition-colors"
          >
            raffi.darrell.f@gmail.com
          </a>
          <a
            href="https://wa.me/6285776616362"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm px-5 py-2.5 rounded border border-line text-muted hover:text-text hover:border-text transition-colors"
          >
            WhatsApp
          </a>
        </div>
        <div className="mt-12 flex justify-center gap-6 font-mono text-xs text-muted">
          <a href="https://github.com/Raeaw" target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/raffidarrell" target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">LinkedIn</a>
        </div>
        <div className="mt-10 font-mono text-[11px] text-line">
          200 OK · built with vite + react + tailwind
        </div>
      </div>
    </section>
  )
}
