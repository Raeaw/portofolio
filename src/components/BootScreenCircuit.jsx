import { useEffect, useState } from "react";

const TOTAL_DURATION = 3200; // ms before fade-out starts
const FADE_DURATION = 550; // ms, must match the CSS transition duration below
const SEGMENTS = 12;
const CHIP_ON_AT = 1050; // ms — when the chip powers on

// Eight PCB-style traces fanning out from the center chip, each a straight
// polyline (right-angle or diagonal bends) for an authentic circuit-board
// look. `points` are used both to draw the trace (stroke-dash) and to move
// a small traveling spark along the same path.
const TRACES = [
	{
		points: [
			[130, 92],
			[60, 92],
			[60, 40],
			[20, 40],
		],
		delay: 0,
	},
	{
		points: [
			[170, 92],
			[240, 92],
			[240, 40],
			[280, 40],
		],
		delay: 90,
	},
	{
		points: [
			[130, 108],
			[60, 108],
			[60, 160],
			[20, 160],
		],
		delay: 180,
	},
	{
		points: [
			[170, 108],
			[240, 108],
			[240, 160],
			[280, 160],
		],
		delay: 270,
	},
	{
		points: [
			[135, 82],
			[95, 60],
			[95, 18],
		],
		delay: 360,
	},
	{
		points: [
			[165, 82],
			[205, 60],
			[205, 18],
		],
		delay: 450,
	},
	{
		points: [
			[135, 118],
			[95, 140],
			[95, 182],
		],
		delay: 540,
	},
	{
		points: [
			[165, 118],
			[205, 140],
			[205, 182],
		],
		delay: 630,
	},
];

function pathLength(points) {
	let len = 0;
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i - 1];
		const [x2, y2] = points[i];
		len += Math.hypot(x2 - x1, y2 - y1);
	}
	return len;
}

function toPathD(points) {
	return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
}

// Background twinkle stars — fixed positions so they read as designed
// texture rather than noise.
const STARS = Array.from({ length: 18 }, (_, i) => ({
	x: (i * 53) % 300,
	y: (i * 97) % 200,
	delay: (i * 137) % 2200,
	size: i % 3 === 0 ? 1.6 : 1,
}));

export default function BootScreenCircuit({ onComplete }) {
	const [percent, setPercent] = useState(0);
	const [chipOn, setChipOn] = useState(false);
	const [flash, setFlash] = useState(false);
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

		const chipTimer = setTimeout(() => {
			setChipOn(true);
			setFlash(true);
		}, CHIP_ON_AT);
		const flashOffTimer = setTimeout(() => setFlash(false), CHIP_ON_AT + 500);
		const fadeTimer = setTimeout(() => setFadingOut(true), TOTAL_DURATION);
		const unmountTimer = setTimeout(() => {
			setMounted(false);
			document.body.style.overflow = "";
			onComplete?.();
		}, TOTAL_DURATION + FADE_DURATION);

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(chipTimer);
			clearTimeout(flashOffTimer);
			clearTimeout(fadeTimer);
			clearTimeout(unmountTimer);
			document.body.style.overflow = "";
		};
	}, [onComplete]);

	if (!mounted) return null;

	const litSegments = Math.floor((percent / 100) * SEGMENTS);

	return (
		<div
			className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink transition-opacity ease-out overflow-hidden ${
				fadingOut ? "opacity-0" : "opacity-100"
			}`}
			style={{ transitionDuration: `${FADE_DURATION}ms` }}
			aria-hidden="true"
		>
			{/* twinkling background stars for extra depth/liveliness */}
			<svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full">
				{STARS.map((s, i) => (
					<circle
						key={i}
						cx={s.x}
						cy={s.y}
						r={s.size}
						fill="rgba(94,234,212,0.5)"
						opacity="0"
						style={{
							animation: `twinkle 2.4s ease-in-out ${s.delay}ms infinite`,
						}}
					/>
				))}
			</svg>

			{/* big radial power-on flash */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(circle at center, rgba(240,180,41,0.35), transparent 55%)",
					opacity: flash ? 1 : 0,
					transition: flash
						? "opacity 80ms ease-out"
						: "opacity 500ms ease-out",
				}}
			/>

			{/* diagonal light-sweep flourish near the end */}
			<div
				className="absolute inset-0 pointer-events-none opacity-0"
				style={{
					background:
						"linear-gradient(100deg, transparent 40%, rgba(94,234,212,0.16) 50%, transparent 60%)",
					animation: `lightSweep 900ms ease-out ${TOTAL_DURATION - 700}ms 1`,
				}}
			/>

			<div className="flex flex-col items-center">
				<div className="relative" style={{ width: 300, height: 200 }}>
					<svg
						viewBox="0 0 300 200"
						className="absolute inset-0 w-full h-full overflow-visible"
					>
						<style>
							{TRACES.map((t, i) => generateTraceKeyframes(i, t.points)).join(
								"\n",
							)}
						</style>
						{TRACES.map((t, i) => {
							const len = pathLength(t.points);
							const d = toPathD(t.points);
							const drawDuration = 620;
							return (
								<g key={i}>
									<path
										d={d}
										fill="none"
										stroke="rgba(94,234,212,0.85)"
										strokeWidth="1.4"
										strokeLinecap="square"
										strokeDasharray={len}
										strokeDashoffset={len}
										style={{
											animation: `traceDraw${i} ${drawDuration}ms ease-out ${t.delay}ms forwards`,
										}}
									/>
									{/* traveling energy spark, follows the same path/timing as the draw */}
									<circle
										r="2.2"
										fill="#F0B429"
										opacity="0"
										style={{
											animation: `sparkMove${i} ${drawDuration}ms linear ${t.delay}ms forwards, sparkFade${i} ${drawDuration}ms linear ${t.delay}ms forwards`,
										}}
									/>
									{/* bend + end nodes lighting up as the current arrives */}
									{t.points.slice(1).map(([px, py], pi) => (
										<rect
											key={pi}
											x={px - 2.5}
											y={py - 2.5}
											width="5"
											height="5"
											fill="rgba(240,180,41,0.9)"
											opacity="0"
											style={{
												animation: `padOn 250ms ease-out ${t.delay + ((pi + 1) / (t.points.length - 1)) * drawDuration}ms forwards`,
											}}
										/>
									))}
								</g>
							);
						})}

						{/* heartbeat pulse rings from the chip before it fully powers on */}
						{!chipOn && (
							<>
								<circle
									cx="150"
									cy="100"
									r="4"
									fill="none"
									stroke="rgba(94,234,212,0.5)"
									strokeWidth="1"
									style={{ animation: "heartbeat 1.1s ease-out infinite" }}
								/>
								<circle
									cx="150"
									cy="100"
									r="4"
									fill="none"
									stroke="rgba(94,234,212,0.5)"
									strokeWidth="1"
									style={{ animation: "heartbeat 1.1s ease-out 0.4s infinite" }}
								/>
							</>
						)}

						{/* central chip */}
						<rect
							x="120"
							y="82"
							width="60"
							height="36"
							rx="3"
							fill="rgba(26,32,41,0.92)"
							stroke={chipOn ? "#F0B429" : "rgba(94,234,212,0.5)"}
							strokeWidth="1.5"
							style={{ transition: "stroke 300ms ease-out" }}
						/>
						{chipOn && (
							<rect
								x="120"
								y="82"
								width="60"
								height="36"
								rx="3"
								fill="none"
								stroke="#F0B429"
								strokeWidth="1.5"
								opacity="0"
								style={{ animation: "chipGlow 1.6s ease-out infinite" }}
							/>
						)}

						{/* outward spark particles bursting from the chip at power-on */}
						{chipOn &&
							Array.from({ length: 10 }).map((_, i) => {
								const angle = (i / 10) * Math.PI * 2;
								const dist = 34 + (i % 3) * 6;
								const dx = Math.cos(angle) * dist;
								const dy = Math.sin(angle) * dist;
								return (
									<circle
										key={i}
										cx="150"
										cy="100"
										r="1.6"
										fill={i % 2 === 0 ? "#F0B429" : "#5EEAD4"}
										opacity="0"
										style={{
											animation: `sparkBurst 700ms ease-out ${i * 15}ms 1`,
											"--dx": `${dx}px`,
											"--dy": `${dy}px`,
										}}
									/>
								);
							})}
					</svg>

					{/* monogram + tagline inside/below the chip */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span
							className="font-mono font-bold text-lg text-text opacity-0"
							style={{
								animation: chipOn
									? "monogramIn 0.5s ease-out forwards"
									: "none",
								textShadow: chipOn ? "0 0 14px rgba(240,180,41,0.5)" : "none",
							}}
						>
							R<span className="text-signal">D</span>
						</span>
					</div>
				</div>

				<div
					className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted opacity-0 mt-1"
					style={{
						animation: chipOn
							? "monogramIn 0.6s ease-out 150ms forwards"
							: "none",
					}}
				>
					portfolio.systems
				</div>

				{/* segmented progress meter */}
				<div className="mt-7 flex flex-col items-center gap-2.5">
					<div className="flex gap-1.5">
						{Array.from({ length: SEGMENTS }).map((_, i) => {
							const t = i / (SEGMENTS - 1);
							const color =
								i < litSegments
									? `rgb(${Math.round(94 + (240 - 94) * t)}, ${Math.round(234 + (180 - 234) * t)}, ${Math.round(212 + (41 - 212) * t)})`
									: "#2B3440";
							return (
								<div
									key={i}
									className="w-2.5 h-1.5 rounded-sm transition-colors duration-200"
									style={{ backgroundColor: color }}
								/>
							);
						})}
					</div>
					<div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
						{percent < 100 ? "powering circuits" : "system online"}
					</div>
				</div>
			</div>

			<style>{`
        @keyframes padOn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes monogramIn {
          from { opacity: 0; transform: scale(0.75); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes chipGlow {
          0% { opacity: 0.7; stroke-width: 1.5; }
          50% { opacity: 0; stroke-width: 7; }
          100% { opacity: 0; stroke-width: 1.5; }
        }
        @keyframes lightSweep {
          from { opacity: 0; transform: translateX(-15%); }
          30% { opacity: 1; }
          to { opacity: 0; transform: translateX(15%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes heartbeat {
          from { r: 4; opacity: 0.6; }
          to { r: 26; opacity: 0; }
        }
        @keyframes sparkBurst {
          from { opacity: 1; transform: translate(0, 0) scale(1); }
          to { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
        }
      `}</style>
		</div>
	);
}

// Generates the per-trace @keyframes for the SVG path stroke-draw and the
// traveling spark's cx/cy, since each trace has different waypoints.
function generateTraceKeyframes(index, points) {
	const totalLength = pathLength(points);
	let cum = 0;
	const stops = points.map((p, i) => {
		if (i > 0) {
			const [x1, y1] = points[i - 1];
			const [x2, y2] = p;
			cum += Math.hypot(x2 - x1, y2 - y1);
		}
		return { pct: (cum / totalLength) * 100, x: p[0], y: p[1] };
	});

	const sparkMoveFrames = stops
		.map((s) => `${s.pct}% { cx: ${s.x}px; cy: ${s.y}px; }`)
		.join(" ");

	return `
    @keyframes traceDraw${index} { to { stroke-dashoffset: 0; } }
    @keyframes sparkMove${index} { ${sparkMoveFrames} }
    @keyframes sparkFade${index} { 0% { opacity: 1; } 92% { opacity: 1; } 100% { opacity: 0; } }
  `;
}
