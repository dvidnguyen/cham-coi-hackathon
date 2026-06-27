import { useRef } from "react";
import { useInView } from "motion/react";

const IMAGES = [
  "/home-sector03/gallery-01.jpg",
  "/home-sector03/gallery-02.jpg",
  "/home-sector03/gallery-03.jpg",
  "/home-sector03/gallery-04.jpg",
  "/home-sector03/gallery-05.jpg",
  "/home-sector03/gallery-06.jpg",
  "/home-sector03/gallery-07.jpg",
  "/home-sector03/gallery-08.jpg",
  "/home-sector03/gallery-09.jpg",
  "/home-sector03/gallery-10.webp",
  "/home-sector03/gallery-11.jpg",
  "/home-sector03/gallery-12.jpg",
];

const COLS = 4;
const ROWS = 3;
const CENTER_R = (ROWS - 1) / 2; // 1
const CENTER_C = (COLS - 1) / 2; // 1.5

/** Grid distance of cell i from the centre — drives the stagger delay. */
function distanceFromCenter(i: number) {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  return Math.hypot(r - CENTER_R, c - CENTER_C);
}

/**
 * Sector 3 — gallery wall.
 * A contained 3×4 image grid (tight black gaps, muted so text reads). On
 * scroll-in the tiles scale + fade up from the centre outward (center-out
 * staggered reveal) via CSS transitions triggered once by `useInView`.
 * Only `opacity` + `scale` transition (not the filter) for smoothness.
 */
export function HomeGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div ref={ref} className="relative h-[440px] w-full md:h-[560px]">
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-4">
          {IMAGES.map((src, i) => (
            <div key={src} className="overflow-hidden">
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                style={{
                  transitionDelay: `${(distanceFromCenter(i) * 0.2).toFixed(2)}s`,
                }}
                className={[
                  "h-full w-full origin-center object-cover saturate-[0.5] brightness-[0.5] transition-[opacity,scale] duration-700 ease-out",
                  inView ? "scale-100 opacity-100" : "scale-50 opacity-0",
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        {/* centre vignette for text legibility over the tiles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,rgba(8,8,10,0.55)_0%,rgba(8,8,10,0)_55%)]"
        />

        {/* title overlay — centered */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="font-script text-2xl text-white/90 md:text-4xl">
            The spaces we shared
          </span>
          <h2 className="font-display text-[clamp(2rem,6vw,5rem)] font-light leading-[0.9] tracking-tight text-white">
            Moments <em className="italic text-white/60">Of</em> Connection
          </h2>
          <Emblem />
        </div>
      </div>
    </section>
  );
}

function Emblem() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="mt-1 h-6 w-6 text-white/70"
    >
      <path
        d="M24 4 L44 24 L24 44 L4 24 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}
