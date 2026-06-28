import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ComingSoonClass {
  id: string;
  title: string;
  artisan: string;
  supporter: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  broadCategory: "history" | "culture" | "artifact" | "craft";
  categoryLabel: string;
  image: string;
  description: string;
}

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "history", label: "Lịch sử" },
  { id: "culture", label: "Văn hóa" },
  { id: "artifact", label: "Cổ vật" },
  { id: "craft", label: "Thủ công" },
] as const;

const COMING_SOON_CLASSES: ComingSoonClass[] = [
  {
    id: "ws-02",
    title: "Workshop tráng men gốm",
    artisan: "Nghệ nhân Lê Thị Nga",
    supporter: "Người hỗ trợ Trần Bảo Anh",
    location: "Khu Bắc",
    date: "2026-06-28",
    startTime: "13:00",
    endTime: "15:30",
    category: "Gom",
    broadCategory: "craft",
    categoryLabel: "Thủ công",
    image: "/home-sector03/gallery-01.jpg",
    description: "Tìm hiểu kỹ thuật tráng men gốm thủ công truyền thống dưới sự hướng dẫn của Nghệ nhân Lê Thị Nga. Học viên được học cách phối màu men tự nhiên từ tro gỗ và khoáng chất tự nhiên để tự tay tráng lớp men bóng bẩy cho tác phẩm gốm.",
  },
  {
    id: "ws-03",
    title: "Buổi phục dựng thủ pháp cổ",
    artisan: "Nghệ nhân Nguyễn Hữu Phúc",
    supporter: "Người hỗ trợ Lê Hoàng Nam",
    location: "Phòng Lưu Trữ",
    date: "2026-06-28",
    startTime: "16:00",
    endTime: "17:30",
    category: "Thu phap",
    broadCategory: "history",
    categoryLabel: "Lịch sử",
    image: "/home-sector03/gallery-02.jpg",
    description: "Khám phá các thủ pháp vẽ thư pháp và phục dựng thư tịch cổ cùng Nghệ nhân Nguyễn Hữu Phúc tại Phòng Lưu Trữ. Lớp học giúp thấu hiểu nghệ thuật sử dụng bút lông và mực tàu trên các chất liệu truyền thống.",
  },
  {
    id: "ws-04",
    title: "Khảm sơn mài căn bản",
    artisan: "Nghệ nhân Pham Thi Hanh",
    supporter: "Người hỗ trợ Pham Gia Han",
    location: "Khu Nam B",
    date: "2026-06-29",
    startTime: "10:00",
    endTime: "12:00",
    category: "Son mai",
    broadCategory: "craft",
    categoryLabel: "Thủ công",
    image: "/home-sector03/gallery-03.jpg",
    description: "Học các bước cơ bản trong nghệ thuật làm sơn mài Việt Nam cùng Nghệ nhân Phạm Thị Hạnh tại Khu Nam B. Tự tay thực hiện kỹ thuật gắn vỏ trứng, lá vàng lá bạc và mài mịn bề mặt tranh.",
  },
  {
    id: "ws-05",
    title: "Trải nghiệm làm giấy dó",
    artisan: "Nghệ nhân Doan Thi Mai",
    supporter: "Người hỗ trợ Vu Khanh Linh",
    location: "Xưởng Sản Xuất",
    date: "2026-06-30",
    startTime: "14:00",
    endTime: "16:30",
    category: "Giay",
    broadCategory: "craft",
    categoryLabel: "Thủ công",
    image: "/home-sector03/gallery-04.jpg",
    description: "Trải nghiệm quy trình xeo giấy dó truyền thống từ vỏ cây dưỡng cùng Nghệ nhân Đoàn Thị Mai tại Xưởng Sản Xuất. Học viên sẽ được tự tay thực hiện các công đoạn từ giã vỏ, xeo giấy đến phơi khô thành phẩm.",
  },
  {
    id: "ws-06",
    title: "Bảo tồn kính màu",
    artisan: "Nghệ nhân Vu Duc Long",
    supporter: "Người hỗ trợ Do Tuan Kiet",
    location: "Kho ưu Trữ Lớn",
    date: "2026-07-01",
    startTime: "09:00",
    endTime: "11:00",
    category: "Kinh mau",
    broadCategory: "artifact",
    categoryLabel: "Cổ vật",
    image: "/home-sector03/gallery-05.jpg",
    description: "Lớp học chuyên sâu về bảo tồn, ghép và phục dựng các mảnh kính màu cổ kính cùng Nghệ nhân Vũ Đức Long. Khám phá bí quyết pha trộn màu vẽ kính chuyên dụng và hàn các thanh chì nâng đỡ kết cấu tranh kính cổ.",
  },
  {
    id: "ws-07",
    title: "Nhuộm chàm truyền thống",
    artisan: "Nghệ nhân Bui Thi Dao",
    supporter: "Người hỗ trợ Nguyen Ha Vy",
    location: "Nhà Bên Sông",
    date: "2026-07-02",
    startTime: "11:30",
    endTime: "14:30",
    category: "Nhuom",
    broadCategory: "culture",
    categoryLabel: "Văn hóa",
    image: "/home-sector03/gallery-06.jpg",
    description: "Khám phá nghệ thuật nhuộm chàm tự nhiên trên sợi vải cùng Nghệ nhân Bùi Thị Đào tại Nhà Bên Sông. Học viên sẽ được giới thiệu về thùng nhuộm chàm lên men tự nhiên và các kỹ thuật thắt buộc tạo hoa văn Shibori.",
  },
];

function formatDateLabel(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [layoutMode, setLayoutMode] = useState<"grid" | "flex">("grid");
  const [notifiedClasses, setNotifiedClasses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Sync notified states with local storage initially
    const syncNotifiedStates = () => {
      const saved = JSON.parse(localStorage.getItem("user-notifications") || "[]");
      const activeNotifs: Record<string, boolean> = {};
      saved.forEach((notif: any) => {
        const match = notif.id.match(/notif-(ws-\d+)-/);
        if (match && match[1]) {
          activeNotifs[match[1]] = true;
        }
      });
      setNotifiedClasses(activeNotifs);
    };

    syncNotifiedStates();

    const handleClear = () => {
      setNotifiedClasses({});
    };

    window.addEventListener("user-notifications-cleared", handleClear);
    window.addEventListener("user-notifications-updated", syncNotifiedStates);
    return () => {
      window.removeEventListener("user-notifications-cleared", handleClear);
      window.removeEventListener("user-notifications-updated", syncNotifiedStates);
    };
  }, []);

  const handleNotifyToggle = (id: string, title: string) => {
    setNotifiedClasses((prev) => {
      const newVal = !prev[id];
      if (newVal) {
        // Add notification
        const newNotif = {
          id: `notif-${id}-${Date.now()}`,
          title: "Đăng ký mới",
          detail: `Bạn đã đăng ký nhận thông báo cho lớp trải nghiệm: "${title}".`,
          tone: "green" as const,
        };
        const current = JSON.parse(localStorage.getItem("user-notifications") || "[]");
        localStorage.setItem("user-notifications", JSON.stringify([newNotif, ...current]));
        window.dispatchEvent(new CustomEvent("user-notifications-updated"));
      } else {
        // Remove notification
        const current = JSON.parse(localStorage.getItem("user-notifications") || "[]");
        const filtered = current.filter((n: any) => !n.id.includes(id));
        localStorage.setItem("user-notifications", JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent("user-notifications-updated"));
      }
      return {
        ...prev,
        [id]: newVal,
      };
    });
  };

  const filteredClasses = useMemo(() => {
    return COMING_SOON_CLASSES.filter((cls) => {
      const matchesCategory =
        selectedCategory === "all" || cls.broadCategory === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        cls.title.toLowerCase().includes(cleanSearch) ||
        cls.description.toLowerCase().includes(cleanSearch) ||
        cls.artisan.toLowerCase().includes(cleanSearch) ||
        cls.supporter.toLowerCase().includes(cleanSearch) ||
        cls.location.toLowerCase().includes(cleanSearch) ||
        cls.categoryLabel.toLowerCase().includes(cleanSearch);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 flex-1 flex flex-col justify-start">
      {/* Header section */}
      <div className="flex flex-col items-center gap-2 py-10 md:py-14 text-center">
        <span className="font-script text-3xl text-amber-200/80 md:text-4xl">
          Chương trình trải nghiệm kì tới
        </span>
        <h1 className="font-display text-5xl font-light tracking-tight text-stone-100 md:text-7xl">
          Lớp Học Sắp Khai Giảng
        </h1>
        <p className="mt-4 max-w-xl text-stone-400 text-xs md:text-sm leading-relaxed">
          Đăng ký tham gia các buổi học trải nghiệm văn hóa, lịch sử và nghệ thuật thủ công truyền thống cùng những nhà nghiên cứu, nghệ nhân hàng đầu tại Chạm Cội.
        </p>
      </div>

      {/* Control Bar: Search, Category Filters, Layout Toggle */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6 mb-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  active
                    ? "bg-stone-100 text-stone-900 font-semibold"
                    : "border border-white/10 text-stone-400 hover:text-stone-100 hover:border-white/30 bg-white/[0.01]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Layout toggle group */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-500">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery === " " ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lớp học..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white/[0.02] border border-white/10 rounded-full text-white placeholder-white/40 focus:border-white/30 focus:bg-white/[0.05] focus:outline-none transition-all duration-300"
            />
            {searchQuery.trim() !== "" && (
              <button
                onClick={() => setSearchQuery(" ")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-100 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 bg-white/[0.02] shrink-0">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                layoutMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-stone-500 hover:text-stone-300"
              }`}
              title="Xem dạng lưới"
              aria-label="Xem dạng lưới"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setLayoutMode("flex")}
              className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                layoutMode === "flex"
                  ? "bg-white/10 text-white"
                  : "text-stone-500 hover:text-stone-300"
              }`}
              title="Xem dạng danh sách"
              aria-label="Xem dạng danh sách"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <AnimatePresence mode="popLayout">
          {filteredClasses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <svg
                viewBox="0 0 24 24"
                width="40"
                height="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-stone-600 mb-4"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <h3 className="font-display text-lg text-stone-300 font-light">Không tìm thấy lớp học</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Không tìm thấy kết quả nào khớp với từ khóa của bạn. Vui lòng thử tìm kiếm khác hoặc xóa bộ lọc.
              </p>
              <button
                onClick={() => {
                  setSearchQuery(" ");
                  setSelectedCategory("all");
                }}
                className="mt-6 border border-white/10 hover:border-white/30 text-stone-300 hover:text-white px-5 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Xóa Bộ Lọc & Tìm Kiếm
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={
                layoutMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "flex flex-col gap-8"
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredClasses.map((cls) => {
                  const isNotified = notifiedClasses[cls.id];
                  return (
                    <motion.div
                      layout
                      key={cls.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`group relative flex bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-500 ${
                        layoutMode === "grid"
                          ? "flex-col"
                          : "flex-col md:flex-row md:items-stretch gap-6 md:gap-8 p-5 md:p-6"
                      }`}
                    >
                      {/* Image container */}
                      <div
                        className={`overflow-hidden relative shrink-0 rounded-xl ${
                          layoutMode === "grid"
                            ? "w-full aspect-[16/10]"
                            : "w-full md:w-2/5 aspect-[16/10] md:aspect-auto max-w-sm"
                        }`}
                      >
                        <img
                          src={cls.image}
                          alt={cls.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent opacity-60" />
                        <span className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase text-amber-200/90">
                          {cls.categoryLabel}
                        </span>
                      </div>

                      {/* Text content details */}
                      <div
                        className={`flex flex-col flex-1 justify-between ${
                          layoutMode === "grid" ? "p-5 gap-4" : "gap-4 p-1 md:p-0"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          {/* Title */}
                          <h3 className="font-display text-xl md:text-2xl font-light text-stone-100 tracking-tight leading-snug group-hover:text-amber-100/90 transition-colors duration-300">
                            {cls.title}
                          </h3>

                          {/* Metadata info */}
                          <div className="flex flex-col gap-2 text-[10px] text-stone-400 font-sans tracking-wide leading-relaxed">
                            <div className="flex items-center gap-2">
                              <svg
                                viewBox="0 0 24 24"
                                width="12"
                                height="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-amber-200/50 shrink-0"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              <span>{formatDateLabel(cls.date)} • {cls.startTime} - {cls.endTime}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg
                                viewBox="0 0 24 24"
                                width="12"
                                height="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-amber-200/50 shrink-0"
                              >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>Địa điểm: <strong className="text-stone-300 font-normal">{cls.location}</strong></span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg
                                viewBox="0 0 24 24"
                                width="12"
                                height="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-amber-200/50 shrink-0"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span>Nghệ nhân: <strong className="text-stone-300 font-normal">{cls.artisan}</strong> <span className="text-stone-500">({cls.supporter})</span></span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-sans font-light mt-1">
                            {cls.description}
                          </p>
                        </div>

                        {/* Action buttons footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => handleNotifyToggle(cls.id, cls.title)}
                            className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 py-1.5 px-4 rounded-full cursor-pointer ${
                              isNotified
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "border border-white/10 hover:border-white/20 text-stone-300 hover:text-white bg-white/[0.01] hover:bg-white/[0.03]"
                            }`}
                          >
                            {isNotified ? (
                              <>
                                <svg
                                  viewBox="0 0 24 24"
                                  width="10"
                                  height="10"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Đã đăng ký</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  viewBox="0 0 24 24"
                                  width="10"
                                  height="10"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                <span>Nhận thông báo</span>
                              </>
                            )}
                          </button>

                          <span className="text-[9px] tracking-wider uppercase text-stone-500 font-semibold">
                            Sắp ra mắt
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
