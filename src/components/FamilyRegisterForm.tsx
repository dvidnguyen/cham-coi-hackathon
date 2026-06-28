import { useId, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field, SectionHead, type FieldChangeEvent } from "@/components/form/Field";

/* ──────────────────────────────────────────────────────────────────────────
 * Family registration — a family member registers an elderly relative to
 * participate (teach / join) at Chạm Cội. Shares the editorial field
 * vocabulary with the B2B contact form via the shared form primitives.
 * ────────────────────────────────────────────────────────────────────────── */

type FormState = {
  elderName: string;
  birthYear: string;
  health: string;
  skills: string;
  contactName: string;
  relation: string;
  phone: string;
  email: string;
  note: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  elderName: "",
  birthYear: "",
  health: "",
  skills: "",
  contactName: "",
  relation: "",
  phone: "",
  email: "",
  note: "",
};

const RELATIONS = ["Con", "Cháu", "Vợ / Chồng", "Người giám hộ", "Khác"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(s: FormState): Errors {
  const e: Errors = {};
  if (!s.elderName.trim()) e.elderName = "Vui lòng nhập tên người cao tuổi.";
  if (!s.birthYear.trim()) e.birthYear = "Vui lòng nhập năm sinh.";
  else if (!/^\d{4}$/.test(s.birthYear.trim()))
    e.birthYear = "Năm sinh không hợp lệ.";
  else {
    const y = Number(s.birthYear.trim());
    const now = new Date().getFullYear();
    if (y < 1900 || y > now) e.birthYear = `Năm sinh từ 1900 đến ${now}.`;
  }
  if (!s.contactName.trim()) e.contactName = "Vui lòng nhập tên người liên hệ.";
  if (!s.relation) e.relation = "Vui lòng chọn mối quan hệ.";
  if (!s.phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
  else if (!/^\d{8,15}$/.test(s.phone.replace(/[^\d]/g, "")))
    e.phone = "Số điện thoại không hợp lệ.";
  if (s.email.trim() && !EMAIL_RE.test(s.email.trim()))
    e.email = "Email không hợp lệ.";
  return e;
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

export function FamilyRegisterForm() {
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

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    // Simulated send — swap for a real endpoint when the backend lands.
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
            Chúng tôi đã ghi nhận{" "}
            <em className="italic text-white/60">đăng ký</em> của gia đình.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Đội ngũ Chạm Cội sẽ liên hệ với{" "}
            <span className="text-white/80">{state.contactName || "quý gia đình"}</span>{" "}
            trong vòng 24 giờ để trao đổi về việc đón tiếp{" "}
            <span className="text-white/80">
              {state.elderName || "người thân"}
            </span>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 px-7 py-3"
          >
            <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
            <span className="relative z-10 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white transition-colors duration-300 group-hover:text-ink">
              Đăng ký thêm
            </span>
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6 md:py-32">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* intro */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-28 md:self-start"
        >
          <span className="font-script text-2xl text-white/90 md:text-3xl">
            Cho người thân của bạn
          </span>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.9] tracking-tight text-white">
            Đăng Ký <em className="italic text-white/60">Tham Gia</em>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Để lại thông tin của người cao tuổi trong gia đình. Chạm Cội sẽ sắp
            xếp gặp gỡ, trao đổi và thiết kế một chương trình phù hợp, an toàn và
            tràn đầy ý nghĩa.
          </p>
          <p className="mt-8 text-xs font-light leading-relaxed text-white/40">
            Mọi thông tin được bảo mật và chỉ dùng cho mục đích liên hệ, chăm sóc.
          </p>
        </motion.aside>

        {/* form */}
        <motion.form
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-14"
        >
          {/* 1 — the elderly person */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead
              index="01"
              eyebrow="Người cao tuổi"
              title="Thông tin người tham gia"
            />
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field
                id={`${uid}-elderName`}
                label="Họ và tên"
                required
                value={state.elderName}
                onChange={onChange("elderName")}
                error={errors.elderName}
                placeholder="Nguyễn Thị C"
                autoComplete="name"
              />
              <Field
                id={`${uid}-birthYear`}
                label="Năm sinh"
                required
                value={state.birthYear}
                onChange={onChange("birthYear")}
                error={errors.birthYear}
                placeholder="1948"
                autoComplete="bday-year"
              />
            </div>
            <div className="mt-7 flex flex-col gap-7">
              <Field
                id={`${uid}-skills`}
                label="Kỹ năng / nghề có thể truyền dạy"
                textarea
                value={state.skills}
                onChange={onChange("skills")}
                placeholder="VD: thêu tay, làm đèn lụa, nấu ăn truyền thống…"
              />
              <Field
                id={`${uid}-health`}
                label="Tình trạng sức khỏe (để chúng tôi chăm sóc tốt hơn)"
                textarea
                value={state.health}
                onChange={onChange("health")}
                placeholder="VD: đi lại bình thường, cần hạn chế đứng lâu…"
              />
            </div>
          </fieldset>

          {/* 2 — family contact */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead
              index="02"
              eyebrow="Người liên hệ"
              title="Thông tin gia đình"
            />
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field
                id={`${uid}-contactName`}
                label="Họ và tên người liên hệ"
                required
                value={state.contactName}
                onChange={onChange("contactName")}
                error={errors.contactName}
                placeholder="Nguyễn Văn D"
                autoComplete="name"
              />
              {/* relation — select */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${uid}-relation`}
                  className="flex items-center gap-1.5 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/50"
                >
                  Mối quan hệ
                  <span className="text-white/30" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-relation`}
                    value={state.relation}
                    onChange={onChange("relation")}
                    aria-invalid={!!errors.relation}
                    aria-describedby={
                      errors.relation ? `${uid}-relation-err` : undefined
                    }
                    className={[
                      "w-full appearance-none border-b bg-transparent py-3 pr-8 text-sm font-light transition-colors duration-300 focus:outline-none",
                      state.relation ? "text-white" : "text-white/40",
                      errors.relation
                        ? "border-rose-400/50 focus:border-rose-400/70"
                        : "border-white/20 focus:border-white",
                    ].join(" ")}
                  >
                    <option value="" disabled className="bg-ink text-white/40">
                      — Chọn mối quan hệ —
                    </option>
                    {RELATIONS.map((r) => (
                      <option key={r} value={r} className="bg-ink text-white">
                        {r}
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
                  {errors.relation && (
                    <motion.p
                      id={`${uid}-relation-err`}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[0.7rem] font-light text-rose-300/80"
                    >
                      {errors.relation}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
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
              <Field
                id={`${uid}-email`}
                label="Email (tùy chọn)"
                type="email"
                value={state.email}
                onChange={onChange("email")}
                error={errors.email}
                placeholder="ten@email.com"
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* 3 — note */}
          <fieldset className="m-0 border-0 p-0">
            <SectionHead index="03" eyebrow="Ghi chú" title="Thêm điều bạn muốn chia sẻ" />
            <Field
              id={`${uid}-note`}
              label="Nội dung ghi chú thêm (tùy chọn)"
              textarea
              value={state.note}
              onChange={onChange("note")}
              placeholder="Thời gian rảnh, mong muốn cụ thể, câu chuyện gia đình…"
            />
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
                {status === "sending" ? "Đang gửi…" : "Gửi đăng ký"}
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
