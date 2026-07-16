import { useEffect, useRef, useState } from "react";

const LINES = [
	{ text: "$ raffi-darrell/portfolio --boot", highlight: true },
	{ text: "checking dependencies......... [ok]" },
	{ text: "mounting components........... [ok]" },
	{ text: "establishing connection....... [ok]" },
	{ text: "status: ready" },
];

const CHAR_SPEED = 26; // ms per character typed
const CHAR_JITTER = 18; // +/- random ms per character, for a more organic terminal feel
const LINE_PAUSE = 260; // ms pause after a line finishes before the next starts
const HOLD_AFTER_DONE = 550; // ms to hold the finished screen before fading out
const FADE_DURATION = 450; // ms, must match the CSS transition duration below

const TOTAL_CHARS = LINES.reduce((sum, l) => sum + l.text.length, 0);

export default function BootScreen({ onComplete }) {
	const [lineIndex, setLineIndex] = useState(0);
	const [charCount, setCharCount] = useState(0);
	const [done, setDone] = useState(false);
	const [fadingOut, setFadingOut] = useState(false);
	const [mounted, setMounted] = useState(true);
	const typedCharsRef = useRef(0); // total characters typed so far, across all lines — drives the progress bar

	useEffect(() => {
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReduced) {
			setMounted(false);
			onComplete?.();
			return;
		}

		document.body.style.overflow = "hidden";
		let cancelled = false;
		let timeoutId;

		function typeNextChar(li, ci) {
			if (cancelled) return;

			if (li >= LINES.length) {
				setDone(true);
				timeoutId = setTimeout(() => {
					setFadingOut(true);
					timeoutId = setTimeout(() => {
						setMounted(false);
						document.body.style.overflow = "";
						onComplete?.();
					}, FADE_DURATION);
				}, HOLD_AFTER_DONE);
				return;
			}

			const currentLine = LINES[li].text;
			if (ci <= currentLine.length) {
				setLineIndex(li);
				setCharCount(ci);
				typedCharsRef.current += 1;
				const jitter = Math.random() * CHAR_JITTER - CHAR_JITTER / 2;
				timeoutId = setTimeout(
					() => typeNextChar(li, ci + 1),
					CHAR_SPEED + jitter,
				);
			} else {
				timeoutId = setTimeout(() => typeNextChar(li + 1, 0), LINE_PAUSE);
			}
		}

		timeoutId = setTimeout(() => typeNextChar(0, 0), 150);

		return () => {
			cancelled = true;
			clearTimeout(timeoutId);
			document.body.style.overflow = "";
		};
	}, [onComplete]);

	if (!mounted) return null;

	const progress = Math.min(
		100,
		Math.round((typedCharsRef.current / TOTAL_CHARS) * 100),
	);

	return (
		<div
			className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink transition-opacity ease-out ${
				fadingOut ? "opacity-0" : "opacity-100"
			}`}
			style={{ transitionDuration: `${FADE_DURATION}ms` }}
			aria-hidden="true"
		>
			{/* faint scanline texture for a CRT/terminal feel */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.04]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
				}}
			/>

			<div className="relative w-[22rem] sm:w-[26rem]">
				{/* status label */}
				<div className="flex items-center gap-2 font-mono text-[11px] text-muted mb-4 tracking-wide uppercase">
					<span className="relative flex w-1.5 h-1.5">
						<span className="absolute inline-flex h-full w-full rounded-full bg-route opacity-60 animate-ping" />
						<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-route" />
					</span>
					system boot
				</div>

				{/* terminal output */}
				<div className="font-mono text-[13px] sm:text-sm leading-relaxed min-h-[8.5rem]">
					{LINES.slice(0, lineIndex + (charCount > 0 || done ? 1 : 0)).map(
						(line, i) => {
							const isCurrent = i === lineIndex && !done;
							const displayText = isCurrent
								? line.text.slice(0, charCount)
								: line.text;
							const isLast = i === LINES.length - 1;
							return (
								<div
									key={i}
									className={`mb-1.5 ${
										line.highlight
											? "text-signal"
											: isLast
												? "text-route font-semibold"
												: "text-route/90"
									}`}
								>
									{displayText}
									{isCurrent && (
										<span className="inline-block w-[7px] h-[1em] bg-route/80 align-middle ml-0.5 animate-pulse" />
									)}
								</div>
							);
						},
					)}
					{done && (
						<span className="inline-block w-[7px] h-[1em] bg-signal align-middle ml-0.5 animate-pulse" />
					)}
				</div>

				{/* progress bar */}
				<div className="mt-6">
					<div className="h-[2px] w-full bg-line/60 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-route to-signal transition-[width] ease-out"
							style={{ width: `${progress}%`, transitionDuration: "120ms" }}
						/>
					</div>
					<div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
						<span>raffi.darrell.systems</span>
						<span>{progress}%</span>
					</div>
				</div>
			</div>
		</div>
	);
}
