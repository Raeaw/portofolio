import { useEffect, useRef, useState } from "react";

const commands = [
	{ id: "top", label: "go top", hint: "", href: "#top" },
	{ id: "about", label: "about", hint: "education", href: "#about" },
	{
		id: "experience",
		label: "experience",
		hint: "experience",
		href: "#experience",
	},
	{
		id: "projects",
		label: "projects",
		hint: "projects",
		href: "#projects",
	},
	{ id: "skills", label: "skills", hint: "skills", href: "#skills" },
	{ id: "contact", label: "contact", hint: "contact", href: "#contact" },
	{
		id: "email",
		label: "email me",
		hint: "mailto:",
		href: "mailto:raffi.darrell.f@gmail.com",
	},
	{
		id: "github",
		label: "open github",
		hint: "external ↗",
		href: "https://github.com/Raeaw",
	},
	{
		id: "linkedin",
		label: "open linkedin",
		hint: "external ↗",
		href: "https://linkedin.com/in/raffidarrell",
	},
];

export default function CommandPalette() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef(null);

	const filtered = commands.filter((c) =>
		(c.label + c.hint).toLowerCase().includes(query.toLowerCase()),
	);

	// Global shortcut: Cmd+K / Ctrl+K to open, Esc to close
	useEffect(() => {
		function onKeyDown(e) {
			const isK = e.key.toLowerCase() === "k";
			if ((e.metaKey || e.ctrlKey) && isK) {
				e.preventDefault();
				setOpen((prev) => !prev);
			} else if (e.key === "Escape") {
				setOpen(false);
			}
		}
		window.addEventListener("keydown", onKeyDown);

		// Allows a visible UI button (e.g. in Nav) to open the palette too
		function onExternalOpen() {
			setOpen(true);
		}
		window.addEventListener("open-command-palette", onExternalOpen);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("open-command-palette", onExternalOpen);
		};
	}, []);

	// Reset state whenever palette opens, and focus the input
	useEffect(() => {
		if (open) {
			setQuery("");
			setActiveIndex(0);
			// slight delay so the element exists before focusing
			const t = setTimeout(() => inputRef.current?.focus(), 10);
			return () => clearTimeout(t);
		}
	}, [open]);

	useEffect(() => {
		setActiveIndex(0);
	}, [query]);

	function runCommand(cmd) {
		if (!cmd) return;
		if (cmd.href.startsWith("http") || cmd.href.startsWith("mailto:")) {
			window.open(
				cmd.href,
				cmd.href.startsWith("mailto:") ? "_self" : "_blank",
			);
		} else {
			document.querySelector(cmd.href)?.scrollIntoView({ behavior: "smooth" });
		}
		setOpen(false);
	}

	function onListKeyDown(e) {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			runCommand(filtered[activeIndex]);
		}
	}

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-ink/70 backdrop-blur-sm"
			onClick={() => setOpen(false)}
		>
			<div
				className="w-full max-w-lg border border-line rounded-lg bg-surface shadow-2xl shadow-black/50 overflow-hidden animate-[fadeIn_0.15s_ease-out]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-2 px-4 py-3 border-b border-line">
					<span className="font-mono text-signal text-sm select-none">$</span>
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={onListKeyDown}
						placeholder="type a command or search…"
						className="flex-1 bg-transparent font-mono text-sm text-text placeholder:text-muted outline-none"
					/>
					<kbd className="font-mono text-[10px] text-muted border border-line rounded px-1.5 py-0.5">
						esc
					</kbd>
				</div>

				<ul className="max-h-72 overflow-y-auto py-1.5">
					{filtered.length === 0 && (
						<li className="px-4 py-3 font-mono text-xs text-muted">
							404 — no command found
						</li>
					)}
					{filtered.map((cmd, i) => (
						<li key={cmd.id}>
							<button
								onClick={() => runCommand(cmd)}
								onMouseEnter={() => setActiveIndex(i)}
								className={`w-full flex items-center justify-between gap-4 px-4 py-2 text-left font-mono text-sm transition-colors ${
									i === activeIndex ? "bg-surface2 text-signal" : "text-text"
								}`}
							>
								<span className="flex items-center gap-2">
									<span
										className={`text-line ${i === activeIndex ? "text-route" : ""}`}
									>
										›
									</span>
									{cmd.label}
								</span>
								<span className="text-[11px] text-muted">{cmd.hint}</span>
							</button>
						</li>
					))}
				</ul>

				<div className="flex items-center justify-between px-4 py-2 border-t border-line font-mono text-[10px] text-muted">
					<span>↑↓ navigate</span>
					<span>↵ select</span>
					<span>esc close</span>
				</div>
			</div>
		</div>
	);
}
