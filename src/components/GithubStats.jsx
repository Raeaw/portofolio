import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import { GithubIcon } from "./Icons.jsx";

const USERNAME = "Raeaw";

export default function GithubStats() {
	const [status, setStatus] = useState("loading"); // 'loading' | 'ready' | 'error'
	const [stats, setStats] = useState(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [userRes, reposRes] = await Promise.all([
					fetch(`https://api.github.com/users/${USERNAME}`),
					fetch(
						`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
					),
				]);

				if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

				const user = await userRes.json();
				const repos = await reposRes.json();

				// Tally languages across non-fork repos
				const langCount = {};
				repos
					.filter((r) => !r.fork && r.language)
					.forEach((r) => {
						langCount[r.language] = (langCount[r.language] || 0) + 1;
					});
				const topLanguages = Object.entries(langCount)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 4)
					.map(([lang]) => lang);

				const latestRepo = repos.find((r) => !r.fork) || repos[0];

				if (!cancelled) {
					setStats({
						publicRepos: user.public_repos,
						followers: user.followers,
						topLanguages,
						latestRepo: latestRepo
							? {
									name: latestRepo.name,
									url: latestRepo.html_url,
									updatedAt: latestRepo.pushed_at,
								}
							: null,
					});
					setStatus("ready");
				}
			} catch (err) {
				if (!cancelled) setStatus("error");
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	if (status === "error") return null; // fail silently, don't clutter the UI

	return (
		<Reveal className="mb-8">
			<div className="border border-line rounded-lg bg-surface/60 px-5 py-4 font-mono text-xs">
				<div className="flex items-center gap-2 text-muted mb-3">
					<span className="text-route"><GithubIcon /></span>
					<span className="text-route">Github</span>
					<span>/stats</span>
					<span
						className={`ml-auto w-1.5 h-1.5 rounded-full ${
							status === "loading" ? "bg-signal animate-pulse" : "bg-route"
						}`}
					/>
				</div>

				{status === "loading" && (
					<div className="text-muted animate-pulse">fetching live data…</div>
				)}

				{status === "ready" && stats && (
					<div className="flex flex-wrap gap-x-8 gap-y-3">
						<div>
							<div className="text-muted mb-1">public repos</div>
							<div className="text-text text-sm">{stats.publicRepos}</div>
						</div>
						<div>
							<div className="text-muted mb-1">followers</div>
							<div className="text-text text-sm">{stats.followers}</div>
						</div>
						{stats.topLanguages.length > 0 && (
							<div>
								<div className="text-muted mb-1">top languages</div>
								<div className="flex flex-wrap gap-1.5">
									{stats.topLanguages.map((l) => (
										<span
											key={l}
											className="px-1.5 py-0.5 border border-line rounded text-route text-[10px]"
										>
											{l}
										</span>
									))}
								</div>
							</div>
						)}
						{stats.latestRepo && (
							<div>
								<div className="text-muted mb-1">latest push</div>
								<a
									href={stats.latestRepo.url}
									target="_blank"
									rel="noreferrer"
									className="text-signal hover:underline text-sm"
								>
									{stats.latestRepo.name} ↗
								</a>
							</div>
						)}
					</div>
				)}
			</div>
		</Reveal>
	);
}
