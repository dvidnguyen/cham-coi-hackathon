# Chạm Cõi Hackathon

Khởi tạo React + TypeScript + TailwindCSS + React Router (Vite).

## Tech stack

- **Vite** — dev server & bundler
- **React 19** + **TypeScript**
- **TailwindCSS v4** (qua `@tailwindcss/vite`)
- **React Router v7** — routing
- **pnpm** — package manager

## Bắt đầu

```bash
pnpm install
pnpm dev          # chạy dev server tại http://localhost:5173
pnpm build        # build production (tsc + vite)
pnpm preview      # xem bản build production
pnpm typecheck    # kiểm tra kiểu
```

## Cấu trúc

```
src/
├── layouts/      # Layout bọc route (MainLayout: header/footer + Outlet)
├── pages/        # Trang (Home, NotFound)
├── router/       # Cấu hình route (React Router v7)
├── index.css     # TailwindCSS entry
└── main.tsx      # Entry point
```

## Routing

Route cấu hình tại `src/router/index.tsx`. Các feature route mới thêm vào mảng
`children` của `MainLayout`. Alias `@/` trỏ tới `src/`.
