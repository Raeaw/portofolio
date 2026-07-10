import SectionHeader from './SectionHeader.jsx'

const items = [
  {
    org: 'KSM Multimedia - Game Development, FIK UPNVJ',
    role: 'Member',
    period: 'May 2025 – December 2025',
    points: [
      'Collaborated within a cross-functional team to design and develop game prototypes, from initial conceptualization to game mechanics implementation.',
      'Analyzed and conducted rigorous playtesting on game systems to identify critical bugs and provide structural feedback on game balancing.',
      'Participated in specialized training sessions and workshops to enhance technical capabilities and understanding of game design logic.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 border-b border-line grid-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="02" title="Experience" />
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.org} className="border border-line rounded-lg bg-surface/70 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <h3 className="text-text font-semibold text-lg">{item.org}</h3>
                <span className="font-mono text-xs text-signal whitespace-nowrap">{item.period}</span>
              </div>
              <p className="font-mono text-xs text-route mb-4">{item.role}</p>
              <ul className="space-y-2">
                {item.points.map((p, i) => (
                  <li key={i} className="text-sm text-muted flex gap-3">
                    <span className="text-line font-mono select-none">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
