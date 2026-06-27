import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-6xl font-bold text-slate-900">404</p>
      <p className="text-slate-600">Trang bạn tìm không tồn tại.</p>
      <Link
        to="/"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
