import { useEffect, useRef } from "react";

const ROUTE = "94, 234, 212"; // teal
const SIGNAL = "240, 180, 41"; // gold

const PARTICLES_PER_BURST = 22;
const LIFETIME = 900; // ms
const MAX_ALIVE = 160; // hard cap across all bursts, protects perf if someone spams right-click
const LINK_DISTANCE = 55; // px, draw a faint connector between nearby burst particles

export default function ParticleBurst() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReduced) return; // no motion effects for these users; native context menu still works fine

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let width = window.innerWidth;
		let height = window.innerHeight;
		let particles = [];
		let rafId;

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

		function isInteractive(el) {
			return el?.closest('a, button, input, textarea, select, [role="button"]');
		}

		function spawnBurst(x, y) {
			const room = MAX_ALIVE - particles.length;
			const count = Math.max(0, Math.min(PARTICLES_PER_BURST, room));
			const now = performance.now();
			for (let i = 0; i < count; i++) {
				const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
				const speed = 0.8 + Math.random() * 2.2;
				particles.push({
					x,
					y,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					born: now,
					gold: Math.random() < 0.15,
					r: 1.3 + Math.random() * 1.4,
				});
			}
		}

		function onContextMenu(e) {
			if (isInteractive(e.target)) return; // let real links/buttons keep their normal right-click menu, no burst
			// Intentionally NOT calling e.preventDefault() — the native browser
			// context menu still opens as usual. This is a bonus visual, not a
			// replacement for expected browser behavior.
			spawnBurst(e.clientX, e.clientY);
		}

		function loop() {
			const now = performance.now();
			ctx.clearRect(0, 0, width, height);

			particles = particles.filter((p) => now - p.born < LIFETIME);

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.vx *= 0.96;
				p.vy *= 0.96;
			}

			// faint connecting lines between nearby burst particles — echoes the
			// background network aesthetic instead of looking like a generic firework
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const a = particles[i];
					const b = particles[j];
					const dist = Math.hypot(a.x - b.x, a.y - b.y);
					if (dist < LINK_DISTANCE) {
						const ageA = (now - a.born) / LIFETIME;
						const ageB = (now - b.born) / LIFETIME;
						const opacity =
							(1 - Math.max(ageA, ageB)) * (1 - dist / LINK_DISTANCE) * 0.25;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.strokeStyle = `rgba(${ROUTE}, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.stroke();
					}
				}
			}

			for (const p of particles) {
				const age = (now - p.born) / LIFETIME;
				const opacity = (1 - age) * 0.8;
				const radius = p.r * (1 - age * 0.5);
				const color = p.gold ? SIGNAL : ROUTE;
				ctx.beginPath();
				ctx.arc(p.x, p.y, Math.max(radius, 0), 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${color}, ${opacity})`;
				ctx.fill();
			}

			rafId = requestAnimationFrame(loop);
		}

		document.addEventListener("contextmenu", onContextMenu);
		rafId = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener("resize", resize);
			document.removeEventListener("contextmenu", onContextMenu);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-[295] pointer-events-none"
			aria-hidden="true"
		/>
	);
}
