/**
 * Centered wordmark: `20 ◍ 25`.
 *
 * The emblem is a placeholder concentric mark ("aperture / realm", riffing on
 * "cõi") — generic and intended to be swapped for the real brand symbol later.
 * It is NOT copied from the reference site's logo.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="hidden text-xs font-light tracking-[0.3em] text-white/40 sm:inline">
        20
      </span>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-7 w-7 text-white"
      >
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1" />
        <circle cx="32" cy="32" r="13" stroke="currentColor" strokeWidth="1" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
      <span className="hidden text-xs font-light tracking-[0.3em] text-white/40 sm:inline">
        25
      </span>
    </span>
  );
}
