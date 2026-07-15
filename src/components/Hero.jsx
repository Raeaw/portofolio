import { MailIcon, GithubIcon, LinkedinIcon } from "./Icons.jsx";
import Reveal from "./Reveal.jsx";

export default function Hero() {
	return (
		<section
			id="top"
			className="grid-bg pt-32 pb-24 px-6 border-b border-line relative overflow-hidden"
		>
			<div className="max-w-5xl mx-auto">
				<Reveal>
					<div className="flex items-center gap-2 font-mono text-xs text-route mb-6">
						<span className="relative flex w-2 h-2">
							<span className="absolute inline-flex h-full w-full rounded-full bg-route opacity-60 animate-ping" />
							<span className="relative inline-flex w-2 h-2 rounded-full bg-route" />
						</span>
						STATUS: available for internship / collab
					</div>
				</Reveal>

				<Reveal delay={100}>
					<h1 className="font-mono font-bold text-4xl sm:text-6xl leading-[1.1] text-text mb-6">
						Raffi Darrell
						<br />
						Firmansyah
					</h1>
				</Reveal>

				<Reveal delay={200}>
					<p className="max-w-xl text-muted text-base sm:text-lg mb-10 leading-relaxed">
						Software Engineering student who routes ideas into working systems —
						from <span className="text-route">auth</span> to{" "}
						<span className="text-route">database</span> to{" "}
						<span className="text-route">UI</span>. I build backend services,
						APIs, and the occasional Android app that has to survive real users.
					</p>
				</Reveal>

				<Reveal delay={300}>
					<div className="mt-8 flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
						<a
							href="mailto:raffi.darrell.f@gmail.com"
							className="flex items-center gap-2 transition-all duration-200 hover:text-signal hover:-translate-y-0.5"
						>
							<MailIcon className="w-4 h-4" />
							raffi.darrell.f@gmail.com
						</a>
						<span className="text-line">|</span>
						<a
							href="https://github.com/Raeaw"
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2 transition-all duration-200 hover:text-signal hover:-translate-y-0.5"
						>
							<GithubIcon className="w-4 h-4" />
							github.com/Raeaw
						</a>
						<span className="text-line">|</span>
						<a
							href="https://linkedin.com/in/raffidarrell"
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2 transition-all duration-200 hover:text-signal hover:-translate-y-0.5"
						>
							<LinkedinIcon className="w-4 h-4" />
							linkedin.com/in/raffidarrell
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
