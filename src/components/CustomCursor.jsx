import { useEffect, useRef, useState } from "react";

const CORNER_SIZE = 8; // px, length of each L-shaped corner arm
const IDLE_FRAME = 16; // px, frame size when not hovering anything
const HOVER_PADDING = 8; // px, extra space around the hovered element's bounds
const LERP = 0.22; // magnetic follow speed (0-1, higher = snappier)

export default function CustomCursor({ hidden = false }) {
	const dotRef = useRef(null);
	const cornerRefs = useRef([null, null, null, null]); // TL, TR, BR, BL
	const [enabled, setEnabled] = useState(false);
	const [hovering, setHovering] = useState(false);

	// Step 1: capability check. Flips `enabled`, which mounts the refs below.
	useEffect(() => {
		const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (hasFinePointer && !prefersReduced) {
			setEnabled(true);
			document.documentElement.classList.add("custom-cursor-active");
		}
		return () =>
			document.documentElement.classList.remove("custom-cursor-active");
	}, []);

	// Step 2: only runs once `enabled` is true and the elements are actually
	// mounted, so refs are guaranteed to exist here.
	useEffect(() => {
		if (!enabled) return;
		const dot = dotRef.current;
		const corners = cornerRefs.current;
		if (!dot || corners.some((c) => !c)) return;

		let mouseX = window.innerWidth / 2;
		let mouseY = window.innerHeight / 2;
		let hoveredEl = null;
		let rafId;

		// current (lerped) frame, and where it's trying to go
		let frame = {
			x: mouseX - IDLE_FRAME / 2,
			y: mouseY - IDLE_FRAME / 2,
			w: IDLE_FRAME,
			h: IDLE_FRAME,
		};

		function placeDot(x, y) {
			dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
		}
		function placeCorners(f) {
			const { x, y, w, h } = f;
			corners[0].style.transform = `translate3d(${x}px, ${y}px, 0)`;
			corners[1].style.transform = `translate3d(${x + w}px, ${y}px, 0) rotate(90deg)`;
			corners[2].style.transform = `translate3d(${x + w}px, ${y + h}px, 0) rotate(180deg)`;
			corners[3].style.transform = `translate3d(${x}px, ${y + h}px, 0) rotate(270deg)`;
		}

		placeDot(mouseX, mouseY);
		placeCorners(frame);

		function onMouseMove(e) {
			mouseX = e.clientX;
			mouseY = e.clientY;
			placeDot(mouseX, mouseY);
		}

		function targetFrame() {
			if (hoveredEl) {
				const r = hoveredEl.getBoundingClientRect();
				return {
					x: r.left - HOVER_PADDING,
					y: r.top - HOVER_PADDING,
					w: r.width + HOVER_PADDING * 2,
					h: r.height + HOVER_PADDING * 2,
				};
			}
			return {
				x: mouseX - IDLE_FRAME / 2,
				y: mouseY - IDLE_FRAME / 2,
				w: IDLE_FRAME,
				h: IDLE_FRAME,
			};
		}

		function loop() {
			const t = targetFrame();
			frame.x += (t.x - frame.x) * LERP;
			frame.y += (t.y - frame.y) * LERP;
			frame.w += (t.w - frame.w) * LERP;
			frame.h += (t.h - frame.h) * LERP;
			placeCorners(frame);
			rafId = requestAnimationFrame(loop);
		}

		function isInteractive(el) {
			return el?.closest(
				'a, button, input, textarea, [role="button"], [data-cursor-hover]',
			);
		}
		function onMouseOver(e) {
			const target = isInteractive(e.target);
			if (target) {
				hoveredEl = target;
				setHovering(true);
			}
		}
		function onMouseOut(e) {
			const target = isInteractive(e.target);
			if (target && target === hoveredEl) {
				hoveredEl = null;
				setHovering(false);
			}
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
			{/* precise center dot — always exactly on the real mouse position.
          `hidden` (true during boot screen) just fades it out via opacity;
          the rAF loop underneath keeps running so position stays in sync
          and it reappears instantly, already correctly placed, once boot ends. */}
			<div
				ref={dotRef}
				className={`fixed top-0 left-0 z-[300] pointer-events-none rounded-full transition-[width,height,background-color,opacity] duration-200 ${
					hovering ? "bg-signal" : "bg-route"
				}`}
				style={{
					width: hovering ? 3 : 4,
					height: hovering ? 3 : 4,
					opacity: hidden ? 0 : 1,
				}}
			/>

			{/* four L-shaped corner brackets forming a magnetic viewfinder frame */}
			{[0, 1, 2, 3].map((i) => (
				<div
					key={i}
					ref={(el) => (cornerRefs.current[i] = el)}
					className="fixed top-0 left-0 z-[300] pointer-events-none transition-opacity duration-200"
					style={{ opacity: hidden ? 0 : 1 }}
				>
					<div
						className={`border-t-2 border-l-2 rounded-tl-[2px] transition-colors duration-200 ${
							hovering ? "border-signal" : "border-route/80"
						}`}
						style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
					/>
				</div>
			))}
		</>
	);
}
