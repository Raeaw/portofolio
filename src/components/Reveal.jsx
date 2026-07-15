import { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * Wraps children and animates them in (fade + slide up) when they enter the viewport.
 * No extra dependency — plain IntersectionObserver.
 *
 * Props:
 *  - as: element tag to render as (default 'div')
 *  - delay: ms delay before the transition starts (useful for stagger)
 *  - className: extra classes merged onto the wrapper
 *  - once: if true (default), animate in only the first time and stay visible after.
 *          if false, the element fades out again when scrolled out of view and
 *          replays the animation every time it re-enters — no reload needed.
 */
export default function Reveal({
	children,
	as: Tag = "div",
	delay = 0,
	className = "",
	once = true,
}) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		// Respect reduced-motion users: show immediately, no animation.
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReduced) {
			setVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisible(true);
						if (once) observer.unobserve(entry.target);
					} else if (!once) {
						setVisible(false);
					}
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [once]);

	return (
		<Tag
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
			} ${className}`}
			style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
		>
			{children}
		</Tag>
	);
}
