import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";

export default function App() {
	return (
		<div className="bg-ink min-h-screen text-text relative">
			{/* Ambient depth layers — fixed behind everything, don't affect layout or scroll */}
			<div className="page-glow" />
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
		</div>
	);
}
