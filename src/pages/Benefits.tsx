import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Donut, type DonutSegment } from "@/components/Donut";
import { SectionHead } from "@/components/form/Field";

/* ───────────────────────────── content ─────────────────────────────
 * "Lan Tỏa Giá Trị — Phúc Lợi Cho Người Cao Tuổi".
 * No hard percentages are shown — proportions only drive the donut geometry;
 * allocation is described qualitatively (largest share first).
 * ──────────────────────────────────────────────────────────────────── */

const HERO_TITLE = ["Nơi giá trị được", "tôn vinh", ",", "cuộc sống được chăm sóc."];

const HERO_SUB =
  "Tại Chạm Cội, mỗi nghệ nhân, mỗi người lớn tuổi không chỉ là người truyền lửa văn hóa mà còn là trung tâm của mọi sự hỗ trợ. Chúng tôi cam kết mang lại một môi trường tôn trọng, an toàn và đảm bảo quyền lợi xứng đáng nhất.";

/** Donut proportions — visual only, NOT displayed as numbers. Order = priority. */
const DONUT_SEGMENTS: DonutSegment[] = [
  { proportion: 6, color: "#f5f5f4" },
  { proportion: 2.5, color: "rgba(245,245,244,0.5)" },
  { proportion: 1.5, color: "rgba(245,245,244,0.22)" },
];

const ALLOCATIONS = [
  {
    color: "#f5f5f4",
    tag: "Phần lớn nhất",
    title: "Thu nhập trực tiếp cho người cao tuổi",
    body: "Mỗi buổi workshop thành công, phần lớn học phí từ người học hoặc ngân sách từ đối tác được chuyển thẳng thành thù lao xứng đáng cho các cụ.",
  },
  {
    color: "rgba(245,245,244,0.5)",
    tag: "Tích lũy",
    title: "Quỹ hỗ trợ & y tế",
    body: "Dành cho hoạt động chăm sóc sức khỏe định kỳ và quà tặng dịp lễ Tết cho các cụ.",
  },
  {
    color: "rgba(245,245,244,0.22)",
    tag: "Tối thiểu",
    title: "Chi phí vận hành & nguyên vật liệu",
    body: "Đội ngũ Business kết nối đối tác, chuẩn bị không gian, công cụ và dụng cụ phục vụ buổi học.",
  },
];

const BENEFITS: { icon: ReactNode; title: string; body: string }[] = [
  {
    title: "Thu nhập tôn nghiêm & độc lập",
    body: "Thù lao được chi trả rõ ràng, minh bạch ngay sau mỗi buổi workshop (hoặc theo tuần/tháng tùy thỏa thuận). Giúp các cụ có thêm nguồn thu nhập tự chủ từ chính tài năng và vốn sống của mình.",
    icon: (
      <path
        d="M12 21V9M12 9c0-3.5 2.8-5.5 6-5.5 0 3.5-2.8 5.5-6 5.5Zm0 3c0-3-2.4-5-5.2-5C6.8 10 9.2 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Chăm sóc sức khỏe & an toàn tại lớp",
    body: "Luôn có nhân sự hỗ trợ túc trực trong suốt buổi workshop để hỗ trợ đi lại, nước uống và các tình huống y tế. Thời gian đứng lớp linh hoạt, tối đa không quá 1.5–2 tiếng/buổi để đảm bảo sức khỏe.",
    icon: (
      <>
        <path
          d="M12 20.5s-7-4.3-7-9.6A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7 3.7c0 .6-.1 1.1-.3 1.7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 13.2h3l1.4-2.2 2 3.3 1.5-1.1H17"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: "Trị liệu tinh thần & xóa nhòa cô đơn",
    body: "Cơ hội gặp gỡ, trò chuyện và truyền nghề cho thế hệ trẻ. Sự ngưỡng mộ, lắng nghe từ người trẻ là liều thuốc tinh thần vô giá, giúp các cụ cảm thấy mình luôn có ích và được xã hội trân trọng.",
    icon: (
      <>
        <circle cx="8.5" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M4 18.5c0-2.4 2-4 4.5-4s4.5 1.6 4.5 4M13 18.5c0-2.4 2-4 4-4s3.5 1.6 3.5 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: "Vinh danh & lưu giữ di sản",
    body: "Câu chuyện cuộc đời, những sản phẩm mỹ nghệ do các cụ làm ra sẽ được ghi nhận, chụp ảnh nghệ thuật và lưu giữ trên không gian số của Chạm Cội như một phần của kho tàng di sản Việt.",
    icon: (
      <>
        <path
          d="M12 3 4 9l8 12 8-12-8-6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M4 9h16M12 3v18" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
  },
];

const STEPS = [
  {
    title: "Khảo sát & thống nhất",
    body: "Team vận hành gặp gỡ trực tiếp để tìm hiểu sức khỏe, lịch rảnh và thống nhất mức thù lao, chính sách phù hợp với từng cụ.",
  },
  {
    title: "Nhận lịch & đứng lớp",
    body: "Các cụ nhận thông báo lịch và tham gia truyền dạy kỹ năng tại không gian ấm cúng, an toàn.",
  },
  {
    title: "Ghi nhận & quyết toán",
    body: "Sau buổi học, hệ thống ghi nhận và chi trả thù lao (tiền mặt hoặc chuyển khoản cho các cụ hoặc người giám hộ) kèm bảng sao kê minh bạch.",
  },
];

/* ──────────────────────────── primitives ─────────────────────────── */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className={className}>
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

/* ────────────────────────────── page ─────────────────────────────── */

export function Benefits() {
  return (
    <article className="w-full">
      {/* ─────────── 1. HERO ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-28 md:pt-36">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-script text-2xl text-white/80 md:text-3xl">
              Lan tỏa giá trị
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.92] tracking-tight text-white">
            {HERO_TITLE[0]}{" "}
            <em className="italic text-white/60">{HERO_TITLE[1]}</em>
            {HERO_TITLE[2]}{" "}
            <span className="text-white">{HERO_TITLE[3]}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            {HERO_SUB}
          </p>
        </Reveal>
      </section>

      {/* ─────────── 2. FINANCIAL TRANSPARENCY ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="01"
            eyebrow="Minh bạch tài chính"
            title="Mỗi khoản thu vì người cao tuổi"
          />
        </Reveal>

        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* donut */}
          <Reveal className="flex justify-center">
            <div className="relative w-64 md:w-72">
              <Donut segments={DONUT_SEGMENTS} className="w-full" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
                <Diamond className="h-5 w-5 text-white/50" />
                <span className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-white/40">
                  Phân bổ
                </span>
              </div>
            </div>
          </Reveal>

          {/* legend */}
          <div className="flex flex-col gap-8">
            {ALLOCATIONS.map((item, i) => (
              <Reveal key={item.title} delay={0.1 * i}>
                <div className="flex gap-4">
                  <span
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-xl font-light text-white">
                        {item.title}
                      </h3>
                      <span className="text-[0.65rem] font-light uppercase tracking-[0.2em] text-white/40">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/55">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <p className="text-xs font-light italic leading-relaxed text-white/35">
              Tỷ lệ cụ thể linh hoạt theo từng dự án, nhưng thù lao cho người cao
              tuổi luôn là ưu tiên hàng đầu.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── 3. CORE BENEFITS ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="02"
            eyebrow="Phúc lợi toàn diện"
            title="Hệ thống phúc lợi"
          />
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={0.08 * (i % 2)}>
              <div className="flex h-full flex-col gap-4 bg-ink p-7 md:p-9">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                    {b.icon}
                  </svg>
                </span>
                <h3 className="font-display text-xl font-light text-white md:text-2xl">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── 4. HOW IT WORKS ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="03"
            eyebrow="Quy trình"
            title="Nhận & quản lý phúc lợi"
          />
        </Reveal>

        <div className="flex flex-col gap-px md:grid md:grid-cols-3 md:gap-0">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={0.1 * i}>
              <div className="flex gap-5 border-t border-white/10 py-7 md:flex-col md:gap-6 md:border-l md:border-t-0 md:pl-7 md:first:border-l-0 md:first:pl-0">
                <span className="font-display text-2xl font-light tracking-widest text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-light text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── 5. CTA ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="flex flex-col items-center gap-10 rounded-sm border border-white/10 bg-white/[0.03] px-6 py-14 text-center md:px-12 md:py-20">
            <span className="font-script text-2xl text-white/80 md:text-3xl">
              Cùng nhau trân quý
            </span>
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,4.5vw,3rem)] font-light leading-[1.05] tracking-tight text-white">
              Mỗi sự tham gia là một{" "}
              <em className="italic text-white/60">di sản</em> được nâng niu.
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* primary — family registration */}
              <Link
                to="/dang-ky-gia-dinh"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-ink transition-opacity duration-300 hover:opacity-90"
              >
                <span className="text-[0.7rem] font-light uppercase tracking-[0.2em]">
                  Đăng ký cho Ông/Bà, Cha/Mẹ
                </span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </Link>
              {/* secondary — partner (existing B2B form) */}
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 px-7 py-3.5"
              >
                <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
                <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-ink">
                  Đồng hành bảo tồn di sản
                </span>
                <Arrow className="relative z-10 text-white transition-all duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-ink" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
