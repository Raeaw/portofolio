export default function SectionHeader({ title, eyebrow }) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <div className="font-mono text-xs text-route mb-2 tracking-wide uppercase">
          {eyebrow}
        </div>
      )}
      <h2 className="font-mono font-bold text-2xl sm:text-3xl text-text">{title}</h2>
      <div className="mt-3 h-px w-12 bg-signal" />
    </div>
  )
}