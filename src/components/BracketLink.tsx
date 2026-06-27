import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type BracketLinkProps = {
  to: string;
  label: string;
  end?: boolean;
  /** Larger display treatment for the mobile overlay. */
  large?: boolean;
  onNavigate?: () => void;
};

/**
 * A nav link rendered as `( Label )`. The parens sit invisible until
 * hovered/active, a small typographic nod to the showcase direction.
 */
export function BracketLink({
  to,
  label,
  end,
  large = false,
  onNavigate,
}: BracketLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      aria-label={label.toLowerCase()}
      className="group inline-flex items-center gap-1.5 py-1"
    >
      {({ isActive }) => (
        <>
          <Bracket active={isActive} char="(" flip />
          <Label active={isActive} large={large}>
            {label}
          </Label>
          <Bracket active={isActive} char=")" />
        </>
      )}
    </NavLink>
  );
}

function Bracket({
  active,
  char,
  flip = false,
}: {
  active: boolean;
  char: "(" | ")";
  flip?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "select-none font-light transition-all duration-300",
        flip ? "translate-x-1 group-hover:translate-x-0" : "-translate-x-1 group-hover:translate-x-0",
        active ? "text-white opacity-100" : "text-white/0 group-hover:text-white/60",
      ].join(" ")}
    >
      {char}
    </span>
  );
}

function Label({
  active,
  large,
  children,
}: {
  active: boolean;
  large: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "tracking-wide transition-colors duration-300",
        large
          ? "font-display text-3xl md:text-5xl"
          : "text-sm font-light uppercase tracking-[0.15em]",
        active ? "text-white" : "text-white/70 group-hover:text-white",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
