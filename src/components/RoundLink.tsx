import { Link } from "react-router-dom";

type RoundLinkProps = {
  to?: string;
  label?: string;
  className?: string;
};

/**
 * A circular outlined button with a diagonal up-right arrow and an inline
 * caption. The arrow nudges diagonally on hover.
 */
export function RoundLink({
  to = "/gallery",
  label = "Ghé trưng bày",
  className = "",
}: RoundLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 group-hover:border-white">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
          className="text-white transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
        >
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/60 transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}
