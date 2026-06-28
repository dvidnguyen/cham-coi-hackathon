import { type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
 * Shared editorial form primitives — dark underline fields, tracked micro
 * labels, hairline section heads. Used by every form in the site so the
 * field vocabulary stays identical (Contact / Family register / …).
 * ────────────────────────────────────────────────────────────────────────── */

/** Event type accepted by every shared control (input / textarea / select). */
export type FieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const BASE =
  "w-full border-b bg-transparent py-3 text-sm font-light text-white placeholder:text-white/25 transition-colors duration-300 focus:outline-none";
const BORDER_OK = "border-white/20 focus:border-white";
const BORDER_ERR = "border-rose-400/50 focus:border-rose-400/70";

export function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  placeholder,
  textarea = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: FieldChangeEvent) => void;
  type?: "text" | "email" | "tel";
  required?: boolean;
  error?: string;
  placeholder?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const control = `${BASE} ${error ? BORDER_ERR : BORDER_OK}`;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/50"
      >
        {label}
        {required && (
          <span className="text-white/30" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`${control} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={control}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[0.7rem] font-light text-rose-300/80"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="text-xs font-light tracking-[0.3em] text-white/40">
          {index}
        </span>
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[0.7rem] font-light uppercase tracking-[0.25em] text-white/60">
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-light text-white/90">
        {title}
      </h3>
    </div>
  );
}
