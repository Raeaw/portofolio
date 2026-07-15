import { useEffect, useRef, useState } from "react";

/**
 * AnimatedText
 * Splits `text` into characters and reveals them one by one (fade + slide up)
 * as soon as the text scrolls into view. Words stay intact when wrapping
 * (each word is wrapped in an inline-block span), only individual letters animate.
 *
 * Props:
 *  - text: the string to animate
 *  - as: element tag to render as (default 'span')
 *  - className: classes for the wrapper (font size, weight, color, etc.)
 *  - baseDelay: ms before the first letter starts (useful to sync with other Reveal elements)
 *  - speed: ms between each letter (default 22 — fast, feels snappy rather than slow-typewriter)
 */
export default function AnimatedText({
	text,
	as: Tag = "span",
	className = "",
	baseDelay = 0,
	speed = 22,
}) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

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
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.4 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const words = text.split(" ");
	let globalIndex = 0;

	return (
		<Tag ref={ref} className={className} aria-label={text}>
			{words.map((word, wi) => (
				<span key={wi} className="inline-block whitespace-nowrap">
					{word.split("").map((char) => {
						const delay = baseDelay + globalIndex * speed;
						globalIndex += 1;
						return (
							<span
								key={globalIndex}
								aria-hidden="true"
								className="inline-block transition-all duration-500 ease-out"
								style={{
									transitionDelay: `${delay}ms`,
									opacity: visible ? 1 : 0,
									transform: visible ? "translateY(0)" : "translateY(0.4em)",
								}}
							>
								{char}
							</span>
						);
					})}
					{/* space between words (not the last word) */}
					{wi < words.length - 1 && "\u00A0"}
				</span>
			))}
		</Tag>
	);
}
