# Chạm Cội Hackathon

Khởi tạo React + TypeScript + TailwindCSS + React Router (Vite), với **Trí Tuệ
Từ Đời Xưa** — trang AI di sản `/tri-thuc` dùng RAG trên kho câu chuyện Việt.

## Tech stack

- **Vite** — dev server & bundler
- **React 19** + **TypeScript**
- **TailwindCSS v4** (qua `@tailwindcss/vite`)
- **React Router v7** — routing
- **Express** — backend RAG server (`server/`)
- **Google Gemini** (`@google/generative-ai`) — chat + embeddings
- **pnpm** — package manager

## Bắt đầu

```bash
pnpm install
pnpm dev          # chỉ frontend (Vite) — không có AI
pnpm dev:all      # frontend + backend cùng lúc (AI hoạt động)
# pnpm build        # build production (tsc + vite)
# pnpm server       # chạy backend, serve dist/ trên 1 cổng (demo)
# pnpm typecheck    # kiểm tra kiểu (frontend)
```

### Cấu hình Gemini API key

Trang `/tri-thuc` cần một Gemini API key (miễn phí tại
<https://aistudio.google.com/apikey>). Tạo file `.env` ở gốc repo:

```
GEMINI_API_KEY=<paste key của bạn>
PORT=3001
```

Không có key thì server vẫn khởi động; `/api/chat` trả `503 NO_API_KEY` và trang
hiện thông báo "Chưa cấu hình GEMINI_API_KEY — xem README".

## Trí Tuệ Từ Đời Xưa (`/tri-thuc`)

Trang chat với một "người lớn tuổi" AI — câu trả lời được chốt lọc bằng RAG từ
kho câu chuyện (seed + đóng góp người dùng), kèm nguồn trích dẫn.

- **RAG trong bộ nhớ**: khởi động nhúng toàn bộ đoạn văn bản một lần, cosine-rank
  khi hỏi, lấy top-4. Xem `server/rag.js`.
- **Mô hình** (Google Gemini): chat `gemini-2.5-flash`, embedding
  `gemini-embedding-001`. Nếu đổi key mà gặp 404 / quota `limit:0`, đổi hằng số
  `EMBED_MODEL` / `CHAT_MODEL` trong `server/rag.js` (gọi `ListModels` để xem
  tên mới).
- **Kho ngữ liệu**: `server/data/seed.json` (24 mục) +
  `server/data/contributions.json` (append lúc chạy).
- **Đóng góp câu chuyện**: form trên trang đẩy câu chuyện mới vào kho RAG ngay
  lập tức — câu hỏi sau đó tìm thấy câu chuyện vừa đóng góp.

## Cấu trúc

```
server/                # Backend RAG (ESM JS, không nằm trong tsconfig)
├── index.js           # Express server + /api/chat + /api/contribute + SPA fallback
├── rag.js             # RAG engine (embed + cosine rank)
└── data/
    ├── seed.json      # 15 câu chuyện seed
    └── contributions.json   # đóng góp runtime (append)
src/
├── layouts/           # Layout bọc route (MainLayout: header/footer + Outlet)
├── pages/             # Trang (Home, Heritage, Benefits, ...)
├── components/        # HeritageChat + các component dùng chung
├── router/            # Cấu hình route (React Router v7)
└── main.tsx           # Entry point
```

## Routing

Route cấu hình tại `src/router/index.tsx`. Các feature route mới thêm vào mảng
`children` của `MainLayout`. Alias `@/` trỏ tới `src/`. Trang AI di sản tại
`/tri-thuc` (xuất hiện trên thanh điều hướng).
