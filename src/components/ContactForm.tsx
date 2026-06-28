import { useId, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field, SectionHead } from "@/components/form/Field";

/* ───────────────────────────── config ───────────────────────────── */

type FormState = {
  fullName: string;
  jobTitle: string;
  workEmail: string;
  phone: string;
  company: string;
  industry: string;
  partnership: string[];
  budget: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  fullName: "",
  jobTitle: "",
  workEmail: "",
  phone: "",
  company: "",
  industry: "",
  partnership: [],
  budget: "",
  message: "",
};

const INDUSTRIES = [
  "Giáo dục (Trường học)",
  "Du lịch",
  "Doanh nghiệp (Corporate)",
  "Tổ chức Phi chính phủ (NGO)",
  "Khác",
] as const;

const PARTNERSHIP_TYPES = [
  { value: "workshop", label: "Đặt lịch Workshop riêng" },
  { value: "sponsor", label: "Tài trợ dự án" },
  { value: "venue", label: "Cung cấp địa điểm tổ chức" },
  { value: "other", label: "Khác" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────────────────────── validation ─────────────────────────── */

function validate(s: FormState): Errors {
  const e: Errors = {};

  if (!s.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên.";
  if (!s.workEmail.trim()) e.workEmail = "Vui lòng nhập email công việc.";
  else if (!EMAIL_RE.test(s.workEmail.trim()))
    e.workEmail = "Email không hợp lệ.";
  if (!s.phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
  else if (!/^\d{8,15}$/.test(s.phone.replace(/[^\d]/g, "")))
    e.phone = "Số điện thoại không hợp lệ.";
  if (!s.company.trim()) e.company = "Vui lòng nhập tên tổ chức.";
  if (!s.industry) e.industry = "Vui lòng chọn lĩnh vực.";

  return e;
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="font-display text-sm font-light tracking-widest text-white/40">
        {n}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-light text-white/80">{title}</span>
        <span className="text-xs font-light leading-relaxed text-white/45">
          {desc}
        </span>
      </span>
    </li>
  );
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

/* ──────────────────────────── the form ──────────────────────────── */

export function ContactForm() {
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

  const togglePartnership = (val: string) =>
    set(
      "partnership",
      state.partnership.includes(val)
        ? state.partnership.filter((v) => v !== val)
        : [...state.partnership, val],
    );

  const onChange =
    (key: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      set(key, e.target.value as never);

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    // Simulated send — replace with a real endpoint when the backend lands.
    const { promise, resolve } = Promise.withResolvers<void>();
    const t = setTimeout(resolve, 1100);
    await promise;
    clearTimeout(t);
    setStatus("done");
  };

  const reset = () => {
    setState(INITIAL);
    setErrors({});
    setStatus("idle");
  };

  /* ── success ── */
  if (status === "done") {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-28 md:px-6 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <Diamond className="h-8 w-8 text-white/60" />
          <span className="font-script text-3xl text-white/90 md:text-4xl">
            Cảm ơn
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-[0.95] tracking-tight text-white">
            Chúng tôi đã nhận được{" "}
            <em className="italic text-white/60">liên hệ</em> của bạn.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Cảm ơn{" "}
            <span className="text-white/80">{state.fullName || "bạn"}</span>
            {state.company && (
              <>
                {" "}
                từ{" "}
                <span className="text-white/80">{state.company}</span>
              </>
            )}
            . Đội ngũ Chạm Cội sẽ liên hệ qua email đã cung cấp trong vòng 24
            giờ để trao đổi chi tiết.
          </p>
          <button
            type="button"
            onClick={reset}
            className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 px-7 py-3"
          >
            <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
            <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-ink">
              Gửi một liên hệ khác
            </span>
          </button>
        </motion.div>
      </section>
    );
  }

  /* ── form ── */
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6 md:py-32">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* intro / narrative column */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-28 md:self-start"
        >
          <span className="font-script text-2xl text-white/90 md:text-3xl">
            Let&rsquo;s collaborate
          </span>
          <h1 className="mt-2 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[0.88] tracking-tight text-white">
            Kết Nối <em className="italic text-white/60">Cùng</em>
            <br />
            Chạm Cội
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Cùng nhau kiến tạo những giá trị vượt thời gian. Hãy để lại thông
            tin, đội ngũ Chạm Cội sẽ đồng hành cùng bạn thiết kế chương trình
            phù hợp.
          </p>

          <ol className="mt-10 space-y-5">
            <Step
              n="01"
              title="Gửi thông tin"
              desc="Để lại chi tiết qua biểu mẫu bên cạnh."
            />
            <Step
              n="02"
              title="Trao đổi ngắn"
              desc="Chúng tôi liên hệ trong 24 giờ để hiểu nhu cầu."
            />
            <Step
              n="03"
              title="Kiến tạo cùng nhau"
              desc="Đề xuất giải pháp & lịch trình phù hợp."
            />
          </ol>
        </motion.aside>

        {/* form column */}
        <motion.form
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-14"
        >
          {/* 1 — contact person */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead
              index="01"
              eyebrow="Contact Person"
              title="Thông tin người đại diện"
            />
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field
                id={`${uid}-fullName`}
                label="Họ và tên"
                required
                value={state.fullName}
                onChange={onChange("fullName")}
                error={errors.fullName}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
              <Field
                id={`${uid}-jobTitle`}
                label="Chức vụ"
                value={state.jobTitle}
                onChange={onChange("jobTitle")}
                placeholder="Giám đốc nhân sự"
                autoComplete="organization-title"
              />
              <Field
                id={`${uid}-workEmail`}
                label="Email công việc"
                required
                type="email"
                value={state.workEmail}
                onChange={onChange("workEmail")}
                error={errors.workEmail}
                placeholder="ten@congty.vn"
                autoComplete="email"
              />
              <Field
                id={`${uid}-phone`}
                label="Số điện thoại"
                required
                type="tel"
                value={state.phone}
                onChange={onChange("phone")}
                error={errors.phone}
                placeholder="+84 90 000 0000"
                autoComplete="tel"
              />
            </div>
          </fieldset>

          {/* 2 — organization */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead
              index="02"
              eyebrow="Organization"
              title="Thông tin tổ chức"
            />
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field
                id={`${uid}-company`}
                label="Tên doanh nghiệp / tổ chức"
                required
                value={state.company}
                onChange={onChange("company")}
                error={errors.company}
                placeholder="Công ty TNHH Chạm Cội"
                autoComplete="organization"
              />
              {/* industry — custom select */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${uid}-industry`}
                  className="flex items-center gap-1.5 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/50"
                >
                  Lĩnh vực hoạt động
                  <span className="text-white/30" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-industry`}
                    value={state.industry}
                    onChange={onChange("industry")}
                    aria-invalid={!!errors.industry}
                    aria-describedby={
                      errors.industry ? `${uid}-industry-err` : undefined
                    }
                    className={[
                      "w-full appearance-none border-b bg-transparent py-3 pr-8 text-sm font-light transition-colors duration-300 focus:outline-none",
                      state.industry ? "text-white" : "text-white/40",
                      errors.industry
                        ? "border-rose-400/50 focus:border-rose-400/70"
                        : "border-white/20 focus:border-white",
                    ].join(" ")}
                  >
                    <option value="" disabled className="bg-ink text-white/40">
                      — Chọn lĩnh vực —
                    </option>
                    {INDUSTRIES.map((opt) => (
                      <option key={opt} value={opt} className="bg-ink text-white">
                        {opt}
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
                <AnimatePresence>
                  {errors.industry && (
                    <motion.p
                      id={`${uid}-industry-err`}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[0.7rem] font-light text-rose-300/80"
                    >
                      {errors.industry}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </fieldset>

          {/* 3 — partnership intent */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead
              index="03"
              eyebrow="Partnership"
              title="Nhu cầu hợp tác"
            />
            <div className="flex flex-col gap-8">
              {/* partnership type — checkboxes */}
              <div className="flex flex-col gap-2">
                <span
                  id={`${uid}-partnership`}
                  className="flex items-center gap-1.5 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/50"
                >
                  Hình thức hợp tác mong muốn
                </span>
                <div
                  className="grid gap-3 pt-2 sm:grid-cols-2"
                  role="group"
                  aria-labelledby={`${uid}-partnership`}
                >
                  {PARTNERSHIP_TYPES.map((opt) => {
                    const checked = state.partnership.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={checked}
                          onChange={() => togglePartnership(opt.value)}
                        />
                        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center border border-white/30 transition-colors duration-300 peer-focus-visible:border-white peer-checked:border-white peer-checked:bg-white">
                          <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            aria-hidden="true"
                            className="text-ink opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                          >
                            <path
                              d="M5 12.5L10 17.5L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="text-sm font-light text-white/70 transition-colors duration-300 group-hover:text-white">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Field
                id={`${uid}-budget`}
                label="Ngân sách dự kiến (tùy chọn)"
                value={state.budget}
                onChange={onChange("budget")}
                placeholder="VD: 20 – 50 triệu VNĐ"
              />

              <Field
                id={`${uid}-message`}
                label="Nội dung chi tiết"
                textarea
                value={state.message}
                onChange={onChange("message")}
                placeholder="Quy mô nhân sự tham gia, mong muốn cụ thể, ý tưởng riêng…"
              />
            </div>
          </fieldset>

          {/* submit */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full border border-white/30 px-8 py-3.5 transition-opacity disabled:opacity-60"
            >
              <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
              <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-ink">
                {status === "sending" ? "Đang gửi…" : "Gửi liên hệ"}
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
              Các trường có dấu <span className="text-white/60">*</span> là bắt
              buộc.
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
