import SectionHeader from "./SectionHeader.jsx";

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
	{ name: "Frontend Bootcamp by KSM Cyber Security", date: "August 2025" },
	{
		name: "Code Generation and Optimization Using IBM Granite",
		date: "October 2025",
	},
	{
		name: "Certificate of Active Participation: Game Development",
		date: "December 2025",
	},
];

export default function Skills() {
	return (
		<section id="skills" className="py-24 px-6 border-b border-line grid-bg">
			<div className="max-w-5xl mx-auto">
				<SectionHeader eyebrow="04" title="Skills & Certifications" />
				<div className="grid md:grid-cols-2 gap-10">
					<div className="space-y-6">
						{groups.map((g) => (
							<div key={g.label}>
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
							</div>
						))}
					</div>

					<div>
						<div className="font-mono text-xs text-signal mb-2">
							Certifications
						</div>
						<ul className="space-y-3">
							{certifications.map((c) => (
								<li
									key={c.name}
									className="border border-line rounded-lg bg-surface/70 p-4"
								>
									<div className="text-sm text-text">{c.name}</div>
									<div className="font-mono text-[11px] text-muted mt-1">
										{c.date}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
