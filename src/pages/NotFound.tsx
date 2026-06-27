import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-display text-7xl font-light tracking-tight text-white md:text-9xl">
        404
      </p>
      <p className="text-sm tracking-wide text-white/60">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-light uppercase tracking-[0.25em] text-white/80 transition-colors hover:bg-white hover:text-ink"
      >
        Back home
      </Link>
    </div>
  );
}
