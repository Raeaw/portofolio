import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";

const courses = [
	"Software Engineering",
	"Service-Oriented Software Development",
	"Data Structures",
	"Algorithms and Programming",
	"Database Systems",
	"Object-Oriented Programming",
	"Operating Systems",
	"Computer Networks",
];

export default function About() {
	return (
		<section id="about" className="py-24 px-6 border-b border-line grid-bg">
			<div className="max-w-5xl mx-auto">
				<Reveal>
					<SectionHeader eyebrow="01" title="Education" />
				</Reveal>
				<div className="grid md:grid-cols-3 gap-8">
					<Reveal delay={80} className="md:col-span-2">
						<h3 className="text-text font-semibold text-lg">
							Universitas Pembangunan Nasional Veteran Jakarta
						</h3>
						<p className="text-muted text-sm mb-1">
							Bachelor of Computer Science (Informatics) · Major Software
							Engineer
						</p>
						<p className="font-mono text-xs text-signal mb-6">
							Expected Graduation: May 2028 · GPA 3.92 / 4.0
						</p>
						<div className="flex flex-wrap gap-2">
							{courses.map((c, i) => (
								<Reveal as="span" key={c} delay={120 + i * 40}>
									<span className="font-mono text-[11px] px-2.5 py-1 border border-line rounded text-muted bg-surface2 inline-block">
										{c}
									</span>
								</Reveal>
							))}
						</div>
					</Reveal>
					<Reveal
						delay={160}
						className="border border-line rounded-lg p-5 bg-surface/60 h-fit"
					>
						<div className="font-mono text-xs text-muted mb-3">// gpa.log</div>
						<div className="flex items-end gap-1 h-24">
							{[3.7, 3.85, 3.9, 3.92].map((g, i) => (
								<div
									key={i}
									className="flex-1 flex flex-col items-center gap-1"
								>
									<div
										className="w-full bg-route/70 rounded-t transition-all duration-700 ease-out"
										style={{ height: `${(g / 4) * 100}%` }}
									/>
									<span className="font-mono text-[9px] text-muted">{g}</span>
								</div>
							))}
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
