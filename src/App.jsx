import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import AnimatedBackground from "./components/AnimatedBackground.jsx";
import BootScreen from "./components/BootScreen.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import CursorTrail from "./components/CursorTrail.jsx";
import BootScreenRadar from "./components/BootScreenRadar.jsx";
import BootScreenCircuit from "./components/BootScreenCircuit.jsx";

export default function App() {
	const [booting, setBooting] = useState(true);

	return (
		<div className="bg-ink min-h-screen text-text relative">
			{/* Ambient depth layers — fixed behind everything, don't affect layout or scroll */}
			<div className="page-glow" />
			<AnimatedBackground />
			<div className="noise-overlay" />

			<div className="content-layer">
				<Nav />
				<main>
					<Hero />
					<About />
					<Experience />
					<Projects />
					<Skills />
					<Contact />
				</main>
			</div>

			{/* Cmd+K / Ctrl+K quick navigation — mounted once, listens globally */}
			<CommandPalette />

			{/* Subtle fading dot trail — hidden during boot, off on touch/reduced-motion */}
			<CursorTrail hidden={booting} />

			{/* Custom cursor — hidden during boot so it doesn't sit frozen center-screen */}
			<CustomCursor hidden={booting} />

			{/* One-time terminal boot sequence shown on first paint */}
			<BootScreenCircuit onComplete={() => setBooting(false)} />

			{/* Vercel Web Analytics — only sends data once deployed on Vercel */}
			<Analytics />
		</div>
	);
}
