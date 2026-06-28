import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
 * HeritageChat — the RAG-grounded conversation with a "heritage elder" AI.
 * Sends POST /api/chat, renders the answer + cited sources. Shares the site's
 * editorial vocabulary (diamond emblem, hairline borders, motion reveal).
 * ────────────────────────────────────────────────────────────────────────── */

type Source = {
  id: string;
  category: string;
  title: string;
  source: string;
  snippet: string;
};

type ChatResponse =
  | { answer: string; sources: Source[] }
  | { error: string; detail?: string };

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const SUGGESTIONS = [
  "Sơn mài là gì?",
  "Kể chuyện trầu cau",
  "Lời khuyên cho người trẻ",
  "Vì sao Tết có mâm ngũ quả?",
];

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

export function HeritageChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as the thread grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data: ChatResponse = await res.json();
      if (!res.ok || "error" in data) {
        if ("error" in data && data.error === "CORPUS_WARMING_UP")
          setError("Đang chuẩn bị kho tri thức — thử lại sau vài giây.");
        else if ("error" in data && data.error === "NO_API_KEY")
          setError("Chưa cấu hình GEMINI_API_KEY — xem README.");
        else setError("Đang gặp lỗi, thử lại sau.");
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer, sources: data.sources },
        ]);
      }
    } catch {
      setError("Không kết nối được tới máy chủ — hãy chắc server đang chạy.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="flex flex-col rounded-sm border border-white/10 bg-white/[0.03]">
      {/* thread */}
      <div
        ref={scrollRef}
        className="flex max-h-[28rem] min-h-72 flex-col gap-6 overflow-y-auto p-6 md:p-8"
      >
        {messages.length === 0 && !loading && (
          <div className="m-auto flex max-w-md flex-col items-center gap-4 text-center">
            <Diamond className="h-7 w-7 text-white/40" />
            <p className="text-sm font-light leading-relaxed text-white/55">
              Hãy hỏi một câu về nghề thủ công, truyện cổ tích, phong tục hay
              lời khuyên từ người xưa. Mỗi câu trả lời đều kèm nguồn câu chuyện.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-white/10 px-4 py-2.5 text-sm font-light leading-relaxed text-white/90">
                  {m.content}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <Diamond className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                  <p className="max-w-[88%] whitespace-pre-line text-sm font-light leading-relaxed text-white/85">
                    {m.content}
                  </p>
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="ml-7 flex flex-col gap-2">
                    <span className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-white/35">
                      Nguồn
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {m.sources.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-sm border border-white/10 bg-white/[0.02] p-3"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-xs font-normal text-white/80">
                              {s.title}
                            </span>
                            <span className="text-[0.6rem] font-light uppercase tracking-[0.2em] text-white/35">
                              {s.category}
                            </span>
                          </div>
                          <p className="mt-1 text-[0.7rem] font-light italic leading-relaxed text-white/45">
                            {s.source}
                          </p>
                          <p className="mt-1.5 text-[0.7rem] font-light leading-relaxed text-white/55">
                            {s.snippet}
                            {s.snippet.length >= 220 ? "…" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ),
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3">
            <Diamond className="h-4 w-4 animate-pulse text-white/50" />
            <span className="animate-pulse text-sm font-light text-white/55">
              Đang hỏi người xưa…
            </span>
          </div>
        )}

        {error && (
          <p className="text-[0.7rem] font-light text-rose-300/80">{error}</p>
        )}
      </div>

      {/* suggestions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-4 md:px-8">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.7rem] font-light text-white/65 transition-colors duration-300 hover:border-white/40 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 border-t border-white/10 p-4 md:p-5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi người xưa…"
          disabled={loading}
          className="flex-1 bg-transparent text-sm font-light text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/25 transition-opacity disabled:opacity-40"
          aria-label="Gửi câu hỏi"
        >
          <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            aria-hidden="true"
            className="relative z-10 text-white transition-colors duration-300 group-hover:text-ink"
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
      </form>
    </div>
  );
}
