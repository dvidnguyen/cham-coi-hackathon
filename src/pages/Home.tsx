import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-7xl font-light tracking-tight text-white md:text-9xl">
        Home
      </h1>
      <Link
        to="/adminpanel"
        className="mt-4 inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-white/85 transition-colors hover:bg-white hover:text-ink"
      >
        Mo Admin Panel
      </Link>
    </div>
  );
}
