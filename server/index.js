import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  initCorpus,
  retrieve,
  addContribution,
  hasKey,
  CHAT_MODEL,
} from "./rag.js";

/* ──────────────────────────────────────────────────────────────────────────
 * Chạm Cội — Heritage AI server.
 *   POST /api/chat        — RAG-grounded answer + cited sources
 *   POST /api/contribute  — append a user story into the live corpus
 * Also serves the built frontend (dist/) on the same port when present,
 * so `pnpm build && pnpm server` is a one-port demo.
 * ────────────────────────────────────────────────────────────────────────── */

const app = express();
app.use(express.json({ limit: "1mb" }));

const genAI = hasKey
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const SYSTEM_PROMPT = `Bạn là "Chạm Cội" — một người bạn đồng hành di sản, trả lời bằng tiếng Việt với giọng điệu ấm áp, chậm rãi của một người lớn tuổi Việt Nam đang trò chuyện với người trẻ. Chỉ dùng các đoạn NGUỒN được cung cấp để trả lời; nếu các đoạn không đủ, hãy thành thật nói chưa đủ câu chuyện từ các cụ, chỉ chia sẻ phần liên quan. Giữ thái độ kính trọng, nhẹ nhàng. Trả lời ngắn gọn (3–6 câu).`;

// Bind the port FIRST so the Vite proxy never sees ECONNREFUSED during the
// ~6-40s startup embedding. /api/chat guards until the corpus is ready.
let corpusReady = false;

app.post("/api/chat", async (req, res) => {
  const question = (req.body?.question ?? "").trim();
  if (!question) return res.status(400).json({ error: "EMPTY_QUESTION" });
  if (!corpusReady) return res.status(503).json({ error: "CORPUS_WARMING_UP" });
  if (!hasKey) return res.status(503).json({ error: "NO_API_KEY" });
  try {
    const sources = await retrieve(question, 4);
    const ctx = sources.length
      ? "NGUỒN:\n" +
        sources
          .map((s) => `[${s.rank}] ${s.title} (${s.source}): ${s.text}`)
          .join("\n")
      : "NGUỒN: (chưa có đoạn phù hợp)";
    const model = genAI.getGenerativeModel({
      model: CHAT_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });
    const r = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: ctx + "\n\nCÂU HỎI: " + question }] }],
    });
    res.json({ answer: r.response.text(), sources });
  } catch (e) {
    res
      .status(500)
      .json({ error: "LLM_FAILED", detail: String((e && e.message) || e) });
  }
});

app.post("/api/contribute", async (req, res) => {
  const { title, category, content, source } = req.body || {};
  if (!title?.trim() || !category?.trim() || !content?.trim())
    return res.status(400).json({ error: "MISSING_FIELDS" });
  const entry = {
    id: randomUUID(),
    category: category.trim(),
    title: title.trim(),
    source: (source || "Đóng góp từ người dùng").trim(),
    text: content.trim(),
  };
  await addContribution(entry);
  res.json({ ok: true, id: entry.id });
});

// Demo/prod: serve the built frontend on the same port when present.
// Final catch-all (SPA fallback) — works on Express 4 and 5.
if (existsSync("dist")) {
  app.use(express.static("dist"));
  app.use((req, res) => res.sendFile("dist/index.html", { root: "." }));
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Chạm Cội API on :${port} (đang nhúng ngữ liệu…)`);
  initCorpus()
    .then(() => {
      corpusReady = true;
      console.log(`Chạm Cội API ready on :${port}`);
    })
    .catch((e) => console.error("[rag] init failed:", String(e?.message || e)));
});
