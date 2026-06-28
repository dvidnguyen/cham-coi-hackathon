import { useState } from "react";
import { motion } from "motion/react";
import { RoundLink } from "@/components/RoundLink";
import { SubImage } from "@/components/SubImage";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeGallery } from "@/components/HomeGallery";

const MAIN = "/home-sector01/main-frame-section01.avif";
const SUBS = [
  { src: "/home-sector01/sub-frame-section01.avif", alt: "Heritage frame I" },
  { src: "/home-sector01/sub-frame-section02.avif", alt: "Heritage frame II" },
  { src: "/home-sector01/sub-frame-section03.avif", alt: "Heritage frame III" },
];

const INTRO =
  "Chạm Cội — Góc nhìn đương đại về di sản Việt được chọn lọc kỹ lưỡng: Nơi ký ức, nghệ nghệ thủ công và những khoảng lặng giao thoa trên từng bức tường.";

export function Home() {
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const mainDimmed = activeSub !== null;

  return (
    <>
    <section className="mx-auto w-full max-w-6xl relative flex w-full flex-col overflow-hidden">
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/home-sector01/bg-sector01.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
      </div>
      {/* ───────── TOP ZONE: image composition ───────── */}
      {/* Desktop / tablet: staggered absolute composition */}
      <div className="relative z-10 hidden h-[66vh] min-h-[500px] md:block">
        {/* text block — top-left */}
        <div className="absolute left-0 top-4 w-52">
          <p className="text-sm leading-relaxed text-white/70">{INTRO}</p>
          <RoundLink className="mt-6" />
        </div>

        {/* sub LEFT — below the text block, mid left edge */}
        <SubImage
          src={SUBS[0].src}
          alt={SUBS[0].alt}
          isActive={activeSub === 0}
          onHoverStart={() => setActiveSub(0)}
          onHoverEnd={() => setActiveSub(null)}
          className="absolute left-0 top-[230px] h-28 w-28 lg:h-32 lg:w-32"
        />

        {/* MAIN — centred focal point, keeps its warm tone */}
        <motion.img
          src={MAIN}
          alt="Heritage in Art — main frame"
          draggable={false}
          loading="eager"
          animate={{ opacity: mainDimmed ? 0.5 : 1, scale: mainDimmed ? 0.97 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 object-cover lg:h-[24rem] lg:w-[24rem]"
        />

        {/* sub RIGHT cluster — the two right frames overlap each other
            (staggered pair: B sits down-right of A, touching it) */}
        <div className="absolute right-[20%] top-[6%]">
          <SubImage
            src={SUBS[1].src}
            alt={SUBS[1].alt}
            isActive={activeSub === 1}
            onHoverStart={() => setActiveSub(1)}
            onHoverEnd={() => setActiveSub(null)}
            className="relative h-28 w-28 lg:h-32 lg:w-32"
          />
          <SubImage
            src={SUBS[2].src}
            alt={SUBS[2].alt}
            isActive={activeSub === 2}
            onHoverStart={() => setActiveSub(2)}
            onHoverEnd={() => setActiveSub(null)}
            className="absolute -bottom-8 left-10 h-28 w-28 lg:h-32 lg:w-32"
          />
        </div>

        {/* Scroll indicator — bottom-right, above the title */}
        <div className="absolute bottom-0 right-0 flex items-center gap-2 text-white/50">
          <span className="text-[01rem] font-light uppercase tracking-[0.3em]">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            aria-hidden="true"
            className="animate-scroll-bob"
          >
            <path
              d="M12 4V20M12 20L6 14M12 20L18 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Mobile: stacked composition (hover bloom is desktop-only) */}
      <div className="relative z-10 flex flex-col items-center gap-8 py-6 md:hidden">
        <div className="w-full max-w-xs">
          <p className="text-sm leading-relaxed text-white/70 text-xl">{INTRO}</p>
          <RoundLink className="mt-6" />
        </div>
        <img
          src={MAIN}
          alt="Heritage in Art — main frame"
          className="h-64 w-64 object-cover"
        />
        <div className="grid grid-cols-3 gap-3">
          {SUBS.map((s) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              className="aspect-square w-full object-cover grayscale"
            />
          ))}
        </div>
      </div>

      {/* ───────── BIG TITLE ───────── */}
      <h1 className="relative z-10 flex items-end ml-10 font-display text-[clamp(3rem,12vw,9rem)] font-light leading-[0.85] tracking-tight text-white">
        <span>Chạm</span>
        <span>Cội</span>
      </h1>
    </section>
    <HomeIntro />
    <HomeGallery />
    </>
  );
}
