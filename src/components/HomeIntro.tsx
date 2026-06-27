import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { RoundLink } from "@/components/RoundLink";

const RIGHT = "/home-sector02/img-rightside-sector02.jpg";
const LEFT = "/home-sector02/img-leftside-sector02.jpg";

const BODY =
  "Bước vào không gian nơi sức trẻ năng động hòa quyện cùng chiều sâu trí tuệ của thế hệ đi trước. Đây là điểm chạm để người trẻ tìm thấy bản ngã từ những di sản vững bền, và người lớn tuổi được truyền cảm hứng bởi lăng kính thời đại mới. Cùng nhau, chúng ta kết nối, thấu hiểu và kiến tạo những giá trị vượt thời gian.";

/** An image that wipes in (ink overlay scales 1→0, left→right) on scroll-in. */
function RevealImage({
  src,
  alt,
  imgClassName,
  frameClassName,
  style,
  duration = 2.4,
}: {
  src: string;
  alt: string;
  imgClassName: string;
  frameClassName?: string;
  style?: MotionStyle;
  duration?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${frameClassName ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        style={style}
        className={imgClassName}
      />
      <motion.div
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 z-10 origin-left bg-ink"
      />
    </div>
  );
}

/**
 * Sector 2 — "Nhịp (Cầu) Giao Thoa Thời Đại".
 * Asymmetrical, magazine-style: big serif heading top-left, vivid right image
 * top-right, centered body + CTA, landscape left image bottom-left.
 *
 * Scroll behaviour: both images are covered by an ink overlay that wipes away
 * left→right when scrolled into view; the right image also drifts with a
 * subtle parallax.
 */
export function HomeIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRight = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={ref}
      className="relative mx-auto w-full max-w-6xl px-4 py-28 md:px-6 md:py-48"
    >
      <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-8">
        {/* Heading — top, left-of-centre */}
        <h2 className="self-start font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-light leading-[0.95] tracking-tight text-white md:col-span-6 md:col-start-1 md:row-start-1">
          Nhịp <span className="text-white/40">(</span>
          <em className="italic">Cầu</em>
          <span className="text-white/40">)</span>
          <br />
          Giao Thoa Thời Đại
        </h2>

        {/* Right image — wipe-in reveal + subtle parallax */}
        <RevealImage
          src={RIGHT}
          alt="Tranh sơn mài — Giao thoa thời đại"
          frameClassName="md:col-span-4 md:col-start-9 md:row-start-1"
          imgClassName="aspect-square w-full scale-125 object-cover"
          style={{ y: yRight }}
        />

        {/* Body + CTA — centred, indented */}
        <div className="max-w-md self-start md:col-span-5 md:col-start-4 md:row-start-2">
          <p className="text-sm leading-relaxed text-white/70 md:text-base">
            {BODY}
          </p>
          <RoundLink to="/about" label="Câu Chuyện Kết Nối" className="mt-8" />
        </div>

        {/* Left image — wipe-in reveal, landscape, bottom-left */}
        <RevealImage
          src={LEFT}
          alt="Tranh sơn mài — Di sản"
          frameClassName="self-end md:col-span-5 md:col-start-1 md:row-start-3"
          imgClassName="aspect-[3/2] w-full object-cover saturate-[0.9]"
        />
      </div>
    </section>
  );
}
