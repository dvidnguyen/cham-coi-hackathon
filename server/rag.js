import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

/* ──────────────────────────────────────────────────────────────────────────
 * In-memory RAG engine.
 * - At startup, embed every corpus passage once and cache { ...embedding }.
 * - On query, embed the question, cosine-rank passages, take top-k.
 * - No external vector DB; embeddings live in process memory.
 * Falls back gracefully when GEMINI_API_KEY is absent: embedText returns null,
 * retrieve returns [], but the corpus is still loaded so sources can be listed.
 * ────────────────────────────────────────────────────────────────────────── */

export const hasKey = !!process.env.GEMINI_API_KEY;
const genAI = hasKey ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const EMBED_MODEL = "gemini-embedding-001";
export const CHAT_MODEL = "gemini-2.5-flash";

/** store: [{ id, category, title, source, text, embedding: number[] }] */
let store = [];

/** Embed a single string. taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY". */
export async function embedText(text, taskType) {
  if (!genAI) return null;
  const model = genAI.getGenerativeModel({ model: EMBED_MODEL });
  const { embedding } = await model.embedContent({
    content: { parts: [{ text }] },
    taskType,
  });
  return embedding.values;
}

/** embedText with bounded retry + backoff — the Gemini free tier can be flaky. */
async function embedWithRetry(text, taskType = "RETRIEVAL_DOCUMENT", tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      return await embedText(text, taskType);
    } catch (e) {
      if (i === tries) throw e;
      await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/** Load seed + contributions, embed each passage once. */
export async function initCorpus() {
  const seed = JSON.parse(
    readFileSync(new URL("./data/seed.json", import.meta.url), "utf8"),
  );
  let contrib = [];
  const cpath = new URL("./data/contributions.json", import.meta.url);
  if (existsSync(cpath)) contrib = JSON.parse(readFileSync(cpath, "utf8"));

  const all = [...seed, ...contrib];
  for (const p of all) {
    p.embedding = await embedWithRetry(`${p.title}. ${p.text}`);
  }
  store = all;
  console.log(
    `[rag] corpus ready — ${store.length} passages (${contrib.length} contributed)`,
  );
}

/** Cosine-rank the store against the question, return top-k passages. */
export async function retrieve(question, k = 4) {
  const q = await embedText(question, "RETRIEVAL_QUERY");
  if (!q) return [];
  return store
    .map((p) => ({ p, score: cosine(q, p.embedding || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x, i) => ({
      rank: i + 1,
      id: x.p.id,
      category: x.p.category,
      title: x.p.title,
      source: x.p.source,
      snippet: x.p.text.slice(0, 220),
      text: x.p.text,
    }));
}

/** Persist a contribution to disk + embed it into the live store. */
export async function addContribution(entry) {
  const cpath = new URL("./data/contributions.json", import.meta.url);
  const list = existsSync(cpath)
    ? JSON.parse(readFileSync(cpath, "utf8"))
    : [];
  list.push(entry);
  writeFileSync(cpath, JSON.stringify(list, null, 2));
  entry.embedding = await embedText(
    `${entry.title}. ${entry.text}`,
    "RETRIEVAL_DOCUMENT",
  );
  store.push(entry);
}
