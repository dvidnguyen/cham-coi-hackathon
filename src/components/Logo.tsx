const LOGO_SRC = "/Logo_wb_main.png";

/**
 * Centered wordmark: `20 [logo] 26`.
 *
 * The brand mark is a transparent PNG whose strokes are mid-tone, so on the
 * dark nav it doesn't read as white. `brightness-0 invert` forces every opaque
 * pixel to pure white while preserving the alpha channel (smooth edges).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="hidden text-xs font-light tracking-[0.3em] text-white/50 sm:inline">
        20
      </span>
      <img
        src={LOGO_SRC}
        alt="Chạm Cội"
        draggable={false}
        className="h-9 w-9 object-contain brightness-0 invert md:h-10 md:w-10"
      />
      <span className="hidden text-xs font-light tracking-[0.3em] text-white/50 sm:inline">
        26
      </span>
    </span>
  );
}
