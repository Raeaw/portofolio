import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
	const dotRef = useRef(null);
	const ringRef = useRef(null);
	const [enabled, setEnabled] = useState(false);
	const [hovering, setHovering] = useState(false);
	const [ready, setReady] = useState(false);

	// Step 1: decide whether this device/preferences allow a custom cursor.
	// This only flips `enabled`, which causes the dot/ring elements below to
	// actually mount — refs don't exist until that render happens.
	useEffect(() => {
		const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (hasFinePointer && !prefersReduced) {
			setEnabled(true);
			document.documentElement.classList.add("custom-cursor-active");
		}
		return () => {
			document.documentElement.classList.remove("custom-cursor-active");
		};
	}, []);

	// Step 2: once enabled (and therefore mounted), the refs point at real
	// DOM nodes — safe to wire up mousemove/rAF tracking here.
	useEffect(() => {
		if (!enabled) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		if (!dot || !ring) return;

		let mouseX = window.innerWidth / 2;
		let mouseY = window.innerHeight / 2;
		let ringX = mouseX;
		let ringY = mouseY;
		let rafId;

		// place both immediately so nothing sits at the default (0,0) corner
		dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
		ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

		function onMouseMove(e) {
			mouseX = e.clientX;
			mouseY = e.clientY;
			dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
			setReady(true);
		}

		function loop() {
			ringX += (mouseX - ringX) * 0.18;
			ringY += (mouseY - ringY) * 0.18;
			ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
			rafId = requestAnimationFrame(loop);
		}

		function isInteractive(el) {
			return el?.closest(
				'a, button, input, textarea, [role="button"], [data-cursor-hover]',
			);
		}
		function onMouseOver(e) {
			if (isInteractive(e.target)) setHovering(true);
		}
		function onMouseOut(e) {
			if (isInteractive(e.target)) setHovering(false);
		}

		window.addEventListener("mousemove", onMouseMove, { passive: true });
		document.addEventListener("mouseover", onMouseOver);
		document.addEventListener("mouseout", onMouseOut);
		rafId = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseover", onMouseOver);
			document.removeEventListener("mouseout", onMouseOut);
			cancelAnimationFrame(rafId);
		};
	}, [enabled]);

	if (!enabled) return null;

	return (
		<>
			{/* small solid dot, tracks instantly */}
			<div
				ref={dotRef}
				className="fixed top-0 left-0 z-[300] pointer-events-none rounded-full bg-route transition-[width,height,opacity] duration-150"
				style={{
					width: hovering ? 0 : 6,
					height: hovering ? 0 : 6,
					opacity: !ready ? 0 : hovering ? 0 : 0.9,
				}}
			/>
			{/* outer ring, trails with lag — morphs from circle to squared brackets on hover */}
			<div
				ref={ringRef}
				className={`fixed top-0 left-0 z-[300] pointer-events-none border transition-[width,height,border-radius,border-color,opacity] duration-200 ease-out ${
					hovering ? "border-signal" : "border-route/70"
				}`}
				style={{
					width: hovering ? 44 : 26,
					height: hovering ? 44 : 26,
					borderRadius: hovering ? 8 : 999,
					opacity: ready ? 1 : 0,
				}}
			/>
		</>
	);
}
