import { type ReactNode, useId, useState } from "react";
import { motion } from "motion/react";
import { HeritageChat } from "@/components/HeritageChat";
import { Field, SectionHead, type FieldChangeEvent } from "@/components/form/Field";

/* ──────────────────────────────────────────────────────────────────────────
 * /tri-thuc — "Trí Tuệ Từ Đời Xưa". An AI heritage elder answers in Vietnamese,
 * grounded by RAG over a seed + user-contributed corpus (see server/rag.js).
 * A contribution form feeds new stories into the same corpus live.
 * ────────────────────────────────────────────────────────────────────────── */

const CATEGORIES = ["Truyện kể", "Nghề thủ công", "Lời khuyên", "Phong tục"] as const;

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

export function Heritage() {
  return (
    <article className="w-full">
      {/* ─────────── hero ─────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-28 md:pt-36">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-script text-2xl text-white/80 md:text-3xl">
              Hỏi người xưa
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.92] tracking-tight text-white">
            Trí Tuệ Từ <em className="italic text-white/60">Đời Xưa</em>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Hỏi những điều bạn muốn biết — câu trả lời được chắt lọc từ câu
            chuyện, nghề thủ công và vốn sống của các cụ.
          </p>
        </Reveal>
      </section>

      {/* ─────────── chat ─────────── */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 md:pb-32">
        <Reveal>
          <HeritageChat />
        </Reveal>
      </section>

      {/* ─────────── contribution ─────────── */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-28 md:pb-40">
        <Reveal>
          <SectionHead
            index="01"
            eyebrow="Mở rộng"
            title="Đóng góp câu chuyện"
          />
        </Reveal>
        <ContributionForm />
      </section>
    </article>
  );
}

type FormState = {
  title: string;
  category: string;
  content: string;
  source: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { title: "", category: "", content: "", source: "" };

function ContributionForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const uid = useId();

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setState((s) => ({ ...s, [key]: val }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const onChange =
    (key: keyof FormState) => (e: FieldChangeEvent) =>
      set(key, e.target.value as never);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!state.title.trim()) errs.title = "Vui lòng nhập tiêu đề.";
    if (!state.category) errs.category = "Vui lòng chọn thể loại.";
    if (!state.content.trim()) errs.content = "Vui lòng nhập nội dung.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: state.title,
          category: state.category,
          content: state.content,
          source: state.source,
        }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      // Surface a soft error; keep the form filled so nothing is lost.
      setStatus("idle");
      setErrors({ content: "Không gửi được — hãy thử lại sau." });
      return;
    }
    setStatus("done");
  };

  const reset = () => {
    setState(INITIAL);
    setErrors({});
    setStatus("idle");
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 py-12 text-center"
      >
        <span className="font-script text-3xl text-white/90 md:text-4xl">
          Cảm ơn
        </span>
        <h2 className="max-w-md font-display text-2xl font-light leading-snug text-white">
          Câu chuyện của bạn đã được gửi.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/55">
          Đóng góp sẽ được đưa vào kho tri thức — những câu hỏi sau đó có thể
          tìm thấy câu chuyện bạn vừa chia sẻ.
        </p>
        <button
          type="button"
          onClick={reset}
          className="group relative mt-2 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 px-7 py-3"
        >
          <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
          <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-ink">
            Đóng góp thêm
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      noValidate
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8"
    >
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field
          id={`${uid}-title`}
          label="Tiêu đề"
          required
          value={state.title}
          onChange={onChange("title")}
          error={errors.title}
          placeholder="VD: Nghề làm bánh chưng"
        />
        {/* category — select */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${uid}-category`}
            className="flex items-center gap-1.5 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/50"
          >
            Thể loại
            <span className="text-white/30" aria-hidden="true">
              *
            </span>
          </label>
          <div className="relative">
            <select
              id={`${uid}-category`}
              value={state.category}
              onChange={onChange("category")}
              aria-invalid={!!errors.category}
              className={[
                "w-full appearance-none border-b bg-transparent py-3 pr-8 text-sm font-light transition-colors duration-300 focus:outline-none",
                state.category ? "text-white" : "text-white/40",
                errors.category
                  ? "border-rose-400/50 focus:border-rose-400/70"
                  : "border-white/20 focus:border-white",
              ].join(" ")}
            >
              <option value="" disabled className="bg-ink text-white/40">
                — Chọn thể loại —
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-ink text-white">
                  {c}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 right-0 text-white/40"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <Field
        id={`${uid}-content`}
        label="Nội dung câu chuyện"
        required
        textarea
        value={state.content}
        onChange={onChange("content")}
        error={errors.content}
        placeholder="Kể câu chuyện, nghề thủ công, hay lời khuyên bạn muốn lưu giữ…"
      />

      <Field
        id={`${uid}-source`}
        label="Tên cụ / Nguồn"
        value={state.source}
        onChange={onChange("source")}
        placeholder="VD: Bà Nguyễn Thị A, 76 tuổi (tùy chọn)"
      />

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full border border-white/30 px-8 py-3.5 transition-opacity disabled:opacity-60"
        >
          <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
          <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-ink">
            {status === "sending" ? "Đang gửi…" : "Gửi câu chuyện"}
          </span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
            className="relative z-10 text-white transition-all duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-ink"
          >
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="text-xs font-light text-white/40">
          Các trường có dấu <span className="text-white/60">*</span> là bắt buộc.
        </p>
      </div>
    </motion.form>
  );
}
