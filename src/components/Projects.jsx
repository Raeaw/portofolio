import SectionHeader from './SectionHeader.jsx'

const projects = [
  {
    name: 'Sistem Pengaduan Mahasiswa',
    subtitle: 'Microservices API',
    stack: ['Node.js', 'Express.js', 'CI 4', 'MongoDB', 'MySQL', 'JWT'],
    points: [
      'Architected a microservices system consisting of Auth, Complaint, and Rating services, routed through a centralized API Gateway on Node.js.',
      'Implemented polyglot persistence: MongoDB for flexible user credentials and complaint documents, MySQL with header-detail architecture for ratings.',
      'Built secure authentication flows supporting local JWT strategies and Google OAuth 2.0 integration.',
      'Applied global rate limiting at the gateway layer using express-rate-limit to prevent endpoint abuse.',
    ],
    link: 'https://github.com/Raeaw',
  },
  {
    name: 'CakeStore',
    subtitle: 'Native Android E-Commerce Application',
    stack: ['Java', 'Android SDK', 'SQLite', 'BCrypt', 'Glide'],
    points: [
      'Developed a native Android bakery e-commerce app with product catalogs, shopping carts, and order history tracking.',
      'Engineered a local database architecture using the Room Persistence Library with dedicated DAOs for users, products, favorites, and transactions.',
      'Implemented secure user authentication using BCrypt for localized password hashing.',
      'Integrated role-based access control with an admin dashboard for product creation, image uploads, and order status updates.',
    ],
    link: 'https://github.com/Raeaw',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 border-b border-line">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="03" title="Projects" />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group border border-line rounded-lg bg-surface/70 p-6 hover:border-signal/50 transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-text font-semibold text-lg">{p.name}</h3>
                <span className="font-mono text-muted group-hover:text-signal transition-colors">↗</span>
              </div>
              <p className="font-mono text-xs text-route mb-4">{p.subtitle}</p>
              <ul className="space-y-2 mb-5 flex-1">
                {p.points.map((pt, i) => (
                  <li key={i} className="text-sm text-muted flex gap-3">
                    <span className="text-line font-mono select-none">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] px-2 py-1 border border-line rounded text-muted bg-surface2"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
