import { useEffect, useRef } from "react";

// Theme colors (kept in sync with tailwind.config.js)
const ROUTE = "94, 234, 212"; // teal
const SIGNAL = "240, 180, 41"; // gold

// Tuning knobs — kept conservative so it reads as "ambient", not "busy"
const DENSITY = 14000; // px^2 per node — higher = fewer nodes
const MAX_SPEED = 0.15; // px per frame
const LINK_DISTANCE = 130; // px, max distance to draw a connecting line
const MOUSE_RADIUS = 160; // px, cursor influence radius

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
			nodes = Array.from({ length: count }, () => {
				const angle = Math.random() * Math.PI * 2;
				const speed = MAX_SPEED * (0.5 + Math.random() * 0.5);
				return {
					x: Math.random() * width,
					y: Math.random() * height,
					// base drift — constant speed, slowly turning angle. Never decays,
					// so nodes keep wandering on their own forever.
					angle,
					speed,
					turnRate: (Math.random() - 0.5) * 0.01,
					// push — temporary extra velocity from mouse proximity, decays back to 0
					pushX: 0,
					pushY: 0,
					r: Math.random() < 0.12 ? 2.2 : 1.2,
					gold: Math.random() < 0.08,
				};
			});
		}

		function step() {
			ctx.clearRect(0, 0, width, height);

			// update + draw nodes
			for (const n of nodes) {
				// base drift: slowly turning angle keeps motion organic instead of
				// straight lines, and never decays — nodes always wander on their own.
				n.angle += n.turnRate;
				const baseVx = Math.cos(n.angle) * n.speed;
				const baseVy = Math.sin(n.angle) * n.speed;

				n.x += baseVx + n.pushX;
				n.y += baseVy + n.pushY;

				if (n.x < 0) n.x = width;
				if (n.x > width) n.x = 0;
				if (n.y < 0) n.y = height;
				if (n.y > height) n.y = 0;

				// gentle push away from cursor — same dynamic as before, layered on
				// top of the constant base drift rather than replacing it
				const dx = n.x - mouse.x;
				const dy = n.y - mouse.y;
				const dist = Math.hypot(dx, dy);
				if (dist < MOUSE_RADIUS) {
					const force = (1 - dist / MOUSE_RADIUS) * 0.06;
					n.pushX += (dx / (dist || 1)) * force;
					n.pushY += (dy / (dist || 1)) * force;
				}
				// only the push decays — base drift speed is untouched, so movement
				// never dies down even when the mouse is far away or idle
				n.pushX *= 0.94;
				n.pushY *= 0.94;

				const color = n.gold ? SIGNAL : ROUTE;
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${color}, 0.55)`;
				ctx.fill();
			}

			// connecting lines between nearby nodes
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
		document.addEventListener("visibilitychange", onVisibilityChange);

		if (prefersReduced) {
			// Render a single static frame — no motion, no rAF loop, no listeners firing further updates.
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
