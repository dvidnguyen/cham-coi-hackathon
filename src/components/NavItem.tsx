import { NavLink } from "react-router-dom";

type NavItemProps = {
  to: string;
  label: string;
  end?: boolean;
  /** Larger display treatment for the mobile overlay. */
  large?: boolean;
  onNavigate?: () => void;
};

/**
 * Plain-text nav link. On hover a thin white underline sweeps in from the
 * left (`origin-left` + `scale-x`), and on the active page it stays put.
 */
export function NavItem({
  to,
  label,
  end,
  large = false,
  onNavigate,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      aria-label={label.toLowerCase()}
      className="group relative inline-flex items-center py-1"
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "tracking-wide transition-colors duration-300",
              large
                ? "font-display text-3xl md:text-5xl"
                : "text-sm font-light uppercase tracking-[0.15em]",
              isActive ? "text-white" : "text-white/70 group-hover:text-white",
            ].join(" ")}
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left bg-white transition-transform duration-300 ease-out",
              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}
