import { useEffect, useRef, useState } from "react";

const links = [
	{ label: "about", href: "#about", id: "about" },
	{ label: "experience", href: "#experience", id: "experience" },
	{ label: "projects", href: "#projects", id: "projects" },
	{ label: "skills", href: "#skills", id: "skills" },
	{ label: "contact", href: "#contact", id: "contact" },
];

const sectionIds = ["top", ...links.map((l) => l.id)];

function openCommandPalette() {
	window.dispatchEvent(new CustomEvent("open-command-palette"));
}

export default function Nav() {
	const [activeId, setActiveId] = useState("top");
	const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
	const listRef = useRef(null);
	const linkRefs = useRef({});

	// Scroll-spy: watch every section, track whichever one currently owns the
	// middle band of the viewport (rootMargin shrinks the trigger zone to a
	// horizontal slice around the vertical center of the screen).
	useEffect(() => {
		const sections = sectionIds
			.map((id) => document.getElementById(id))
			.filter(Boolean);

		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Pick the entry closest to the vertical center of the viewport
				// among the ones currently intersecting, so fast scrolls don't
				// flicker between neighbors.
				const visible = entries.filter((e) => e.isIntersecting);
				if (visible.length === 0) return;

				const centerY = window.innerHeight / 2;
				let closest = visible[0];
				let closestDist = Infinity;
				for (const entry of visible) {
					const rect = entry.boundingClientRect;
					const dist = Math.abs((rect.top + rect.bottom) / 2 - centerY);
					if (dist < closestDist) {
						closestDist = dist;
						closest = entry;
					}
				}
				setActiveId(closest.target.id);
			},
			{ rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
		);

		sections.forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	}, []);

	// Move the sliding indicator to sit under/behind the active link.
	useEffect(() => {
		const el = linkRefs.current[activeId];
		const container = listRef.current;
		if (!el || !container) {
			setIndicator((prev) => ({ ...prev, opacity: 0 }));
			return;
		}
		const containerRect = container.getBoundingClientRect();
		const elRect = el.getBoundingClientRect();
		setIndicator({
			left: elRect.left - containerRect.left,
			width: elRect.width,
			opacity: 1,
		});
	}, [activeId]);

	// Recompute on resize so the pill stays aligned if layout shifts.
	useEffect(() => {
		function onResize() {
			const el = linkRefs.current[activeId];
			const container = listRef.current;
			if (!el || !container) return;
			const containerRect = container.getBoundingClientRect();
			const elRect = el.getBoundingClientRect();
			setIndicator({
				left: elRect.left - containerRect.left,
				width: elRect.width,
				opacity: 1,
			});
		}
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [activeId]);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-ink/90 backdrop-blur-sm">
			<nav className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
				<a
					href="#top"
					className={`font-mono text-sm tracking-tight transition-colors ${
						activeId === "top" ? "text-signal" : "text-text hover:text-signal"
					}`}
				>
					<span className="text-signal">$</span> raffi.darrell
				</a>

				<ul
					ref={listRef}
					className="hidden md:flex items-center gap-1 font-mono text-xs relative"
				>
					{/* sliding active-section indicator */}
					<span
						className="absolute top-0 h-full rounded bg-surface2 border border-line/80 transition-all duration-300 ease-out pointer-events-none"
						style={{
							left: indicator.left,
							width: indicator.width,
							opacity: indicator.opacity,
						}}
					/>
					{links.map((l) => {
						const isActive = activeId === l.id;
						return (
							<li key={l.href} className="relative z-10">
								<a
									ref={(el) => (linkRefs.current[l.id] = el)}
									href={l.href}
									className="group flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 hover:-translate-y-0.5"
								>
									<span
										className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
											isActive
												? "bg-signal scale-125 shadow-[0_0_6px_rgba(240,180,41,0.7)]"
												: "bg-route/60 group-hover:bg-route group-hover:scale-125"
										}`}
									/>
									<span
										className={`transition-colors duration-200 ${
											isActive
												? "text-signal"
												: "text-muted group-hover:text-text"
										}`}
									>
										/{l.label}
									</span>
								</a>
							</li>
						);
					})}
				</ul>

				<div className="flex items-center gap-3">
					<button
						onClick={openCommandPalette}
						aria-label="Open quick navigation"
						className="hidden sm:flex items-center gap-2 font-mono text-xs px-2.5 py-1.5 rounded border border-line text-muted transition-all duration-200 hover:text-text hover:border-text hover:-translate-y-0.5"
					>
						<span>search</span>
						<kbd className="text-[10px] border border-line rounded px-1 py-0.5 text-muted">
							⌘K
						</kbd>
					</button>
					<a
						href="https://wa.me/6285776616362"
						target="_blank"
						rel="noreferrer"
						className="font-mono text-xs px-3 py-1.5 rounded border border-signal/40 text-signal transition-all duration-200 hover:bg-signal hover:text-ink hover:-translate-y-0.5 hover:shadow-md hover:shadow-signal/20"
					>
						connect →
					</a>
				</div>
			</nav>
		</header>
	);
}
