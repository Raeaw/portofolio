import { useEffect, useRef } from "react";

// Kept deliberately restrained — a trail is easy to overdo. These knobs
// control that restraint:
const SPAWN_INTERVAL = 45; // ms between new trail dots (higher = sparser)
const LIFETIME = 420; // ms a dot takes to fully fade out
const MAX_DOTS = 14; // hard cap on dots alive at once
const MIN_MOVE_DIST = 4; // px — only spawn a dot if the mouse actually moved this much

const ROUTE = "94, 234, 212";

export default function CursorTrail({ hidden = false }) {
	const canvasRef = useRef(null);
	const hiddenRef = useRef(hidden);
	hiddenRef.current = hidden;

	useEffect(() => {
		const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (!hasFinePointer || prefersReduced) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let width = window.innerWidth;
		let height = window.innerHeight;

		function resize() {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
		resize();
		window.addEventListener("resize", resize);

		let dots = [];
		let lastX = null;
		let lastY = null;
		let lastSpawn = 0;
		let rafId;

		function onMouseMove(e) {
			if (hiddenRef.current) return;
			const now = performance.now();
			const dx = lastX === null ? Infinity : e.clientX - lastX;
			const dy = lastY === null ? Infinity : e.clientY - lastY;
			const moved = Math.hypot(dx, dy) >= MIN_MOVE_DIST;

			if (moved && now - lastSpawn >= SPAWN_INTERVAL) {
				dots.push({ x: e.clientX, y: e.clientY, born: now });
				if (dots.length > MAX_DOTS) dots.shift();
				lastSpawn = now;
				lastX = e.clientX;
				lastY = e.clientY;
			} else if (lastX === null) {
				lastX = e.clientX;
				lastY = e.clientY;
			}
		}

		function loop() {
			const now = performance.now();
			ctx.clearRect(0, 0, width, height);

			dots = dots.filter((d) => now - d.born < LIFETIME);

			for (const d of dots) {
				const age = (now - d.born) / LIFETIME; // 0 → 1
				const opacity = (1 - age) * 0.35; // capped low so it never overpowers content
				const radius = 3 * (1 - age * 0.6); // shrinks slightly as it fades

				ctx.beginPath();
				ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${ROUTE}, ${opacity})`;
				ctx.fill();
			}

			rafId = requestAnimationFrame(loop);
		}

		window.addEventListener("mousemove", onMouseMove, { passive: true });
		rafId = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouseMove);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-[290] pointer-events-none"
			aria-hidden="true"
		/>
	);
}
