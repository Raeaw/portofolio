import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";

const groups = [
	{ label: "Languages", items: ["Indonesian", "English"] },
	{
		label: "Programming",
		items: [
			"JavaScript",
			"TypeScript",
			"PHP",
			"SQL",
			"Python",
			"HTML/CSS",
			"C",
			"C++",
			"C#",
		],
	},
	{
		label: "Frameworks & Libraries",
		items: ["React.js", "Node.js", "Express.js", "Vite", "CodeIgniter 4"],
	},
	{
		label: "Game Development",
		items: [
			"Unity",
			"Universal Render Pipeline (URP)",
			"Unity Input System",
			"Game Design",
			"Level Design",
		],
	},
	{ label: "Databases", items: ["MongoDB", "MySQL"] },
	{
		label: "Developer Tools",
		items: ["Git", "GitHub", "Mermaid.js", "Postman", "Docker", "Figma"],
	},
];

const certifications = [
	{
		name: "Frontend Bootcamp by KSM Cyber Security",
		date: "August 2025",
		link: "",
	},
	{
		name: "Code Generation and Optimization Using IBM Granite",
		date: "October 2025",
		link: "",
	},
	{
		name: "Certificate of Active Participation: Game Development",
		date: "December 2025",
		link: "",
	},
];

export default function Skills() {
	return (
		<section id="skills" className="py-24 px-6 border-b border-line grid-bg">
			<div className="max-w-5xl mx-auto">
				<Reveal>
					<SectionHeader eyebrow="04" title="Skills & Certifications" />
				</Reveal>
				<div className="grid md:grid-cols-2 gap-10">
					<div className="space-y-6">
						{groups.map((g, gi) => (
							<Reveal key={g.label} delay={gi * 70} once={false}>
								<div className="font-mono text-xs text-signal mb-2">
									{g.label}
								</div>
								<div className="flex flex-wrap gap-2">
									{g.items.map((s) => (
										<span
											key={s}
											className="font-mono text-[11px] px-2.5 py-1 border border-line rounded text-text bg-surface2"
										>
											{s}
										</span>
									))}
								</div>
							</Reveal>
						))}
					</div>

					<div>
						<Reveal>
							<div className="font-mono text-xs text-signal mb-2">
								Certifications
							</div>
						</Reveal>
						<ul className="space-y-3">
							{certifications.map((c, ci) => (
								<Reveal as="li" key={c.name} delay={100 + ci * 80}>
									<a
										href={c.link}
										target="_blank"
										rel="noreferrer"
										className="group flex items-center justify-between gap-4 border border-line rounded-lg bg-surface/70 p-4 hover:border-signal/50 transition-colors"
									>
										<div>
											<div className="text-sm text-text">{c.name}</div>
											<div className="font-mono text-[11px] text-muted mt-1">
												{c.date}
											</div>
										</div>
										<span className="font-mono text-muted group-hover:text-signal transition-colors">
											↗
										</span>
									</a>
								</Reveal>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
