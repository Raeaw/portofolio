export default function Hero() {
	return (
		<section
			id="top"
			className="grid-bg pt-32 pb-24 px-6 border-b border-line relative overflow-hidden"
		>
			<div className="max-w-5xl mx-auto">
				<div className="flex items-center gap-2 font-mono text-xs text-route mb-6">
					<span className="w-2 h-2 rounded-full bg-route animate-pulse" />
					STATUS: available for internship / collab
				</div>

				<h1 className="font-mono font-bold text-4xl sm:text-6xl leading-[1.1] text-text mb-6">
					Raffi Darrell
					<br />
					Firmansyah
				</h1>

				<p className="max-w-xl text-muted text-base sm:text-lg mb-10 leading-relaxed">
					Software Engineering student who routes ideas into working systems -
					from <span className="text-route">auth</span> to{" "}
					<span className="text-route">database</span> to{" "}
					<span className="text-route">UI</span>. I build backend services,
					APIs, and the occasional Android app that has to survive real users.
				</p>

				<div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-muted">
					<a
						href="mailto:raffi.darrell.f@gmail.com"
						className="hover:text-signal transition-colors"
					>
						raffi.darrell.f@gmail.com
					</a>
					<span className="text-line">|</span>
					<a
						href="https://github.com/Raeaw"
						target="_blank"
						rel="noreferrer"
						className="hover:text-signal transition-colors"
					>
						github.com/Raeaw
					</a>
					<span className="text-line">|</span>
					<a
						href="https://linkedin.com/in/raffidarrell"
						target="_blank"
						rel="noreferrer"
						className="hover:text-signal transition-colors"
					>
						linkedin.com/in/raffidarrell
					</a>
				</div>
			</div>
		</section>
	);
}
