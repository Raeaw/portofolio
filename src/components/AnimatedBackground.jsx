import { useEffect, useRef } from "react";

// Theme colors (kept in sync with tailwind.config.js)
const ROUTE = "94, 234, 212"; // teal
const SIGNAL = "240, 180, 41"; // gold

// Tuning knobs — kept conservative so it reads as "ambient", not "busy"
const DENSITY = 14000; // px^2 per node — higher = fewer nodes
const MAX_SPEED = 0.15; // px per frame
const LINK_DISTANCE = 130; // px, max distance to draw a connecting line
const MOUSE_RADIUS = 160; // px, cursor influence radius

// Click-to-spawn tuning
const SPAWN_PER_CLICK = 4;
const MAX_TOTAL_NODES = 220;
const SPAWN_BURST_SPEED = 0.5;

// Overcrowd shockwave tuning
const GRID_CELL = 70; // px, size of each density-check bucket
const CROWD_THRESHOLD = 6; // nodes in one cell before it's considered "too dense"
const CHECK_INTERVAL_MS = 500; // how often to re-scan density (not every frame — cheap but not free)
const CELL_COOLDOWN_MS = 2500; // don't re-trigger the same area again this soon
const SHOCKWAVE_DURATION = 650; // ms, ring lifetime
const SHOCKWAVE_MAX_RADIUS = 90; // px
const DISPERSE_FORCE = 2.3; // outward push strength applied to nodes caught in the shockwave

function makeAmbientNode(width, height) {
	const angle = Math.random() * Math.PI * 2;
	const speed = MAX_SPEED * (0.5 + Math.random() * 0.5);
	return {
		x: Math.random() * width,
		y: Math.random() * height,
		angle,
		speed,
		turnRate: (Math.random() - 0.5) * 0.01,
		pushX: 0,
		pushY: 0,
		r: Math.random() < 0.12 ? 2.2 : 1.2,
		gold: Math.random() < 0.08,
		spawned: false,
	};
}

function makeSpawnedNode(x, y) {
	const angle = Math.random() * Math.PI * 2;
	return {
		x,
		y,
		angle,
		speed: MAX_SPEED * (0.6 + Math.random() * 0.5),
		turnRate: (Math.random() - 0.5) * 0.012,
		pushX: Math.cos(angle) * SPAWN_BURST_SPEED,
		pushY: Math.sin(angle) * SPAWN_BURST_SPEED,
		r: Math.random() < 0.2 ? 2.4 : 1.4,
		gold: Math.random() < 0.25,
		spawned: true,
		bornAt: performance.now(),
	};
}

export default function AnimatedBackground() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let nodes = [];
		let shockwaves = []; // { x, y, born }
		let cellCooldowns = new Map(); // cellKey -> last-triggered timestamp
		let lastDensityCheck = 0;
		let width = 0;
		let height = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let animationId = null;
		let running = true;

		const mouse = { x: -9999, y: -9999 };

		function resize() {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const count = Math.min(
				90,
				Math.max(28, Math.floor((width * height) / DENSITY)),
			);
			nodes = Array.from({ length: count }, () =>
				makeAmbientNode(width, height),
			);
		}

		function isInteractive(el) {
			return el?.closest(
				'a, button, input, textarea, select, [role="button"], [data-cursor-hover]',
			);
		}

		function onClick(e) {
			if (e.button !== 0) return;
			if (isInteractive(e.target)) return;

			for (let i = 0; i < SPAWN_PER_CLICK; i++) {
				nodes.push(makeSpawnedNode(e.clientX, e.clientY));
			}
			if (nodes.length > MAX_TOTAL_NODES) {
				nodes.splice(0, nodes.length - MAX_TOTAL_NODES);
			}
		}

		// Buckets nodes into a coarse grid and looks for cells holding more
		// nodes than CROWD_THRESHOLD. Each overcrowded cell (not on cooldown)
		// gets a small outward impulse applied to its own nodes only, plus a
		// visual ring centered on that cluster's centroid.
		function checkDensityAndDisperse(now) {
			const buckets = new Map(); // cellKey -> node[]
			for (const n of nodes) {
				const cx = Math.floor(n.x / GRID_CELL);
				const cy = Math.floor(n.y / GRID_CELL);
				const key = `${cx},${cy}`;
				if (!buckets.has(key)) buckets.set(key, []);
				buckets.get(key).push(n);
			}

			for (const [key, bucketNodes] of buckets) {
				if (bucketNodes.length < CROWD_THRESHOLD) continue;

				const lastTrigger = cellCooldowns.get(key) || 0;
				if (now - lastTrigger < CELL_COOLDOWN_MS) continue;

				cellCooldowns.set(key, now);

				// centroid of this crowded cluster
				let cx = 0;
				let cy = 0;
				for (const n of bucketNodes) {
					cx += n.x;
					cy += n.y;
				}
				cx /= bucketNodes.length;
				cy /= bucketNodes.length;

				// push only the nodes in this cluster outward from the centroid —
				// everywhere else on the canvas is untouched
				for (const n of bucketNodes) {
					const dx = n.x - cx;
					const dy = n.y - cy;
					const dist = Math.hypot(dx, dy) || 1;
					n.pushX += (dx / dist) * DISPERSE_FORCE;
					n.pushY += (dy / dist) * DISPERSE_FORCE;
				}

				shockwaves.push({ x: cx, y: cy, born: now });
			}
		}

		function step() {
			const now = performance.now();
			ctx.clearRect(0, 0, width, height);

			if (!prefersReduced && now - lastDensityCheck > CHECK_INTERVAL_MS) {
				lastDensityCheck = now;
				checkDensityAndDisperse(now);
			}

			// update + draw nodes
			for (const n of nodes) {
				n.angle += n.turnRate;
				const baseVx = Math.cos(n.angle) * n.speed;
				const baseVy = Math.sin(n.angle) * n.speed;

				n.x += baseVx + n.pushX;
				n.y += baseVy + n.pushY;

				if (n.x < 0) n.x = width;
				if (n.x > width) n.x = 0;
				if (n.y < 0) n.y = height;
				if (n.y > height) n.y = 0;

				const dx = n.x - mouse.x;
				const dy = n.y - mouse.y;
				const dist = Math.hypot(dx, dy);
				if (dist < MOUSE_RADIUS) {
					const force = (1 - dist / MOUSE_RADIUS) * 0.06;
					n.pushX += (dx / (dist || 1)) * force;
					n.pushY += (dy / (dist || 1)) * force;
				}
				n.pushX *= 0.94;
				n.pushY *= 0.94;

				let entryOpacity = 1;
				if (n.spawned) {
					const age = now - n.bornAt;
					entryOpacity = Math.min(1, age / 500);
				}

				const color = n.gold ? SIGNAL : ROUTE;
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${color}, ${0.55 * entryOpacity})`;
				ctx.fill();
			}

			// connecting lines
			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const a = nodes[i];
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const dist = Math.hypot(dx, dy);
					if (dist < LINK_DISTANCE) {
						const opacity = (1 - dist / LINK_DISTANCE) * 0.12;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.strokeStyle = `rgba(${ROUTE}, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.stroke();
					}
				}
			}

			// shockwave rings — small expanding, fading circles marking where a
			// crowded cluster was just dispersed
			shockwaves = shockwaves.filter((s) => now - s.born < SHOCKWAVE_DURATION);
			for (const s of shockwaves) {
				const age = (now - s.born) / SHOCKWAVE_DURATION;
				const eased = 1 - Math.pow(1 - age, 3); // ease-out
				const radius = eased * SHOCKWAVE_MAX_RADIUS;
				const opacity = (1 - age) * 0.5;
				ctx.beginPath();
				ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(${SIGNAL}, ${opacity})`;
				ctx.lineWidth = 1.4;
				ctx.stroke();
			}

			if (running) animationId = requestAnimationFrame(step);
		}

		function onMouseMove(e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}
		function onMouseLeave() {
			mouse.x = -9999;
			mouse.y = -9999;
		}
		function onVisibilityChange() {
			running = document.visibilityState === "visible" && !prefersReduced;
			if (running && !animationId) step();
			if (!running && animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		}

		resize();
		window.addEventListener("resize", resize);
		window.addEventListener("mousemove", onMouseMove, { passive: true });
		window.addEventListener("mouseleave", onMouseLeave);
		window.addEventListener("click", onClick);
		document.addEventListener("visibilitychange", onVisibilityChange);

		if (prefersReduced) {
			step();
			running = false;
		} else {
			step();
		}

		return () => {
			running = false;
			if (animationId) cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseleave", onMouseLeave);
			window.removeEventListener("click", onClick);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-0 pointer-events-none"
			aria-hidden="true"
		/>
	);
}
