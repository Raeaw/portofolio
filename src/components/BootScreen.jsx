import { useEffect, useState } from "react";

const LINES = [
	{ text: "$ initializing system…", delay: 0 },
	{ text: "$ loading modules… [ok]", delay: 260 },
	{ text: "$ mounting components… [ok]", delay: 480 },
	{ text: "$ ready.", delay: 700 },
];

const HOLD_AFTER_READY = 320; // ms to keep "$ ready." visible before fading out
const FADE_DURATION = 400; // ms, must match the CSS transition duration below

export default function BootScreen() {
	const [visibleLines, setVisibleLines] = useState(0);
	const [fadingOut, setFadingOut] = useState(false);
	const [mounted, setMounted] = useState(true);

	useEffect(() => {
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		// Reduced-motion users skip straight past the sequence — show nothing,
		// don't block their first paint with an animation they didn't ask for.
		if (prefersReduced) {
			setMounted(false);
			return;
		}

		document.body.style.overflow = "hidden";

		const timers = LINES.map((line, i) =>
			setTimeout(() => setVisibleLines(i + 1), line.delay),
		);

		const totalDelay = LINES[LINES.length - 1].delay + HOLD_AFTER_READY;
		const fadeTimer = setTimeout(() => setFadingOut(true), totalDelay);
		const unmountTimer = setTimeout(() => {
			setMounted(false);
			document.body.style.overflow = "";
		}, totalDelay + FADE_DURATION);

		return () => {
			timers.forEach(clearTimeout);
			clearTimeout(fadeTimer);
			clearTimeout(unmountTimer);
			document.body.style.overflow = "";
		};
	}, []);

	if (!mounted) return null;

	return (
		<div
			className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink transition-opacity ease-out ${
				fadingOut ? "opacity-0" : "opacity-100"
			}`}
			style={{ transitionDuration: `${FADE_DURATION}ms` }}
			aria-hidden="true"
		>
			<div className="font-mono text-sm sm:text-base text-route w-72 sm:w-96">
				{LINES.slice(0, visibleLines).map((line, i) => (
					<div
						key={i}
						className="mb-1.5 opacity-0 animate-[bootLineIn_0.3s_ease-out_forwards]"
					>
						{line.text}
					</div>
				))}
				{visibleLines < LINES.length && (
					<span className="inline-block w-2 h-4 bg-route align-middle animate-pulse" />
				)}
			</div>
		</div>
	);
}
