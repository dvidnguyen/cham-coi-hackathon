import { NavLink } from "react-router-dom";

/**
 * The Contact call-to-action: a pill with an up-right arrow and a white
 * "bubble" that swells in from behind on hover, inverting the contents.
 */
export function ContactButton({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <NavLink
      to="/contact"
      onClick={onNavigate}
      aria-label="contact"
      className={[
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 px-5 py-2",
        className,
      ].join(" ")}
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
          />
          <Arrow
            className={`relative z-10 transition-colors duration-300 group-hover:text-ink ${
              isActive ? "text-white" : "text-white/80"
            }`}
          />
          <span
            className={`relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-ink ${
              isActive ? "text-white" : "text-white/80"
            }`}
          >
            Contact
          </span>
        </>
      )}
    </NavLink>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
