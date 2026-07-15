import { MailIcon, WhatsappIcon, GithubIcon, LinkedinIcon } from "./Icons.jsx";
import Reveal from "./Reveal.jsx";

export default function Contact() {
	return (
		<section id="contact" className="py-24 px-6">
			<Reveal as="div" className="max-w-5xl mx-auto text-center">
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
						className="flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded border border-signal text-signal transition-all duration-200 hover:bg-signal hover:text-ink hover:-translate-y-0.5 hover:shadow-md hover:shadow-signal/20"
					>
						<MailIcon className="w-4 h-4" />
						raffi.darrell.f@gmail.com
					</a>
					<a
						href="https://wa.me/6285776616362"
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded border border-line text-muted transition-all duration-200 hover:text-text hover:border-text hover:-translate-y-0.5"
					>
						<WhatsappIcon className="w-4 h-4" />
						WhatsApp
					</a>
				</div>
				<div className="mt-12 flex justify-center gap-6 font-mono text-xs text-muted">
					<a
						href="https://github.com/Raeaw"
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2 transition-all duration-200 hover:text-signal hover:-translate-y-0.5"
					>
						<GithubIcon className="w-4 h-4" />
						GitHub
					</a>
					<a
						href="https://linkedin.com/in/raffidarrell"
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2 transition-all duration-200 hover:text-signal hover:-translate-y-0.5"
					>
						<LinkedinIcon className="w-4 h-4" />
						LinkedIn
					</a>
				</div>
				<div className="mt-10 font-mono text-[11px] text-line">
					200 OK · built with vite + react + tailwind
				</div>
			</Reveal>
		</section>
	);
}
