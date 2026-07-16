import { useEffect, useState } from "react";

const TOTAL_DURATION = 2800; // ms, full boot sequence before fade-out starts
const FADE_DURATION = 500; // ms, must match the CSS transition duration below
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Predetermined "blips" — fixed positions/timings so the sequence feels
// designed rather than jittery/random on every load. angle in degrees,
// radius as a fraction of the radar's radius, delay in ms.
const BLIPS = [
	{ angle: 40, r: 0.55, delay: 300 },
	{ angle: 190, r: 0.75, delay: 650 },
	{ angle: 290, r: 0.4, delay: 950 },
	{ angle: 120, r: 0.85, delay: 1300 },
	{ angle: 320, r: 0.6, delay: 1700 },
	{ angle: 20, r: 0.3, delay: 2050 },
];

export default function BootScreenRadar({ onComplete }) {
	const [percent, setPercent] = useState(0);
	const [fadingOut, setFadingOut] = useState(false);
	const [mounted, setMounted] = useState(true);

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
		const start = performance.now();
		let rafId;

		function tick() {
			const elapsed = performance.now() - start;
			setPercent(Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100)));
			if (elapsed < TOTAL_DURATION) {
				rafId = requestAnimationFrame(tick);
			}
		}
		rafId = requestAnimationFrame(tick);

		const fadeTimer = setTimeout(() => setFadingOut(true), TOTAL_DURATION);
		const unmountTimer = setTimeout(() => {
			setMounted(false);
			document.body.style.overflow = "";
			onComplete?.();
		}, TOTAL_DURATION + FADE_DURATION);

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(fadeTimer);
			clearTimeout(unmountTimer);
			document.body.style.overflow = "";
		};
	}, [onComplete]);

	if (!mounted) return null;

	return (
		<div
			className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink transition-opacity ease-out ${
				fadingOut ? "opacity-0" : "opacity-100"
			}`}
			style={{ transitionDuration: `${FADE_DURATION}ms` }}
			aria-hidden="true"
		>
			<div className="flex flex-col items-center">
				{/* radar dish */}
				<div className="relative" style={{ width: 220, height: 220 }}>
					<svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
						{/* concentric rings */}
						<circle
							cx="100"
							cy="100"
							r="90"
							fill="none"
							stroke="rgba(94,234,212,0.18)"
							strokeWidth="1"
						/>
						<circle
							cx="100"
							cy="100"
							r="60"
							fill="none"
							stroke="rgba(94,234,212,0.14)"
							strokeWidth="1"
						/>
						<circle
							cx="100"
							cy="100"
							r="30"
							fill="none"
							stroke="rgba(94,234,212,0.1)"
							strokeWidth="1"
						/>
						{/* crosshair */}
						<line
							x1="100"
							y1="10"
							x2="100"
							y2="190"
							stroke="rgba(94,234,212,0.1)"
							strokeWidth="1"
						/>
						<line
							x1="10"
							y1="100"
							x2="190"
							y2="100"
							stroke="rgba(94,234,212,0.1)"
							strokeWidth="1"
						/>

						{/* progress arc — traces the outer ring as the boot progresses */}
						<circle
							cx="100"
							cy="100"
							r={RADIUS}
							fill="none"
							stroke="url(#arcGradient)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeDasharray={CIRCUMFERENCE}
							strokeDashoffset={CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE}
							transform="rotate(-90 100 100)"
							style={{ transition: "stroke-dashoffset 100ms linear" }}
						/>
						<defs>
							<linearGradient
								id="arcGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#5EEAD4" />
								<stop offset="100%" stopColor="#F0B429" />
							</linearGradient>
						</defs>
					</svg>

					{/* rotating sweep beam, clipped to the circle */}
					<div className="absolute inset-0 rounded-full overflow-hidden">
						<div
							className="absolute inset-0 origin-center animate-[radarSpin_2.2s_linear_infinite]"
							style={{
								background:
									"conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(94,234,212,0.28) 355deg, transparent 360deg)",
							}}
						/>
					</div>

					{/* blips */}
					{BLIPS.map((b, i) => {
						const rad = (b.angle * Math.PI) / 180;
						const dist = b.r * RADIUS;
						const x = 100 + Math.cos(rad) * dist;
						const y = 100 + Math.sin(rad) * dist;
						return (
							<div
								key={i}
								className="absolute w-1.5 h-1.5 rounded-full bg-signal opacity-0"
								style={{
									left: `${(x / 200) * 100}%`,
									top: `${(y / 200) * 100}%`,
									transform: "translate(-50%, -50%)",
									animation: `blipIn 1.8s ease-out ${b.delay}ms infinite`,
								}}
							/>
						);
					})}

					{/* center monogram with ping halo */}
					<div className="absolute inset-0 flex items-center justify-center">
						<span
							className="absolute w-10 h-10 rounded-full border border-route opacity-0"
							style={{ animation: "pingOnce 1s ease-out 700ms 1" }}
						/>
						<span
							className="font-mono font-bold text-2xl text-text opacity-0"
							style={{ animation: "monogramIn 0.6s ease-out 750ms forwards" }}
						>
							R<span className="text-signal">D</span>
						</span>
					</div>
				</div>

				{/* status label + percentage */}
				<div className="mt-6 flex flex-col items-center gap-2">
					<div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
						{percent < 100 ? "scanning network" : "system online"}
					</div>
					<div className="font-mono text-xs text-route">{percent}%</div>
				</div>
			</div>

			<style>{`
        @keyframes radarSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes blipIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          30% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pingOnce {
          0% { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(2.6); }
        }
        @keyframes monogramIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
		</div>
	);
}
