import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Blocks,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleEllipsis,
  Cog,
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  SquareChartGantt,
  UserRound,
  Users,
  X,
} from "lucide-react";

type SidebarItem = {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
  badge?: string;
};

type WorkshopStatus = "dang-dien-ra" | "sap-toi" | "hoan-tat" | "da-huy";

type WorkshopItem = {
  id: string;
  title: string;
  artisan: string;
  supporter: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  capacity: number;
  category: string;
  status: WorkshopStatus;
};

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  tone: "green" | "amber" | "red";
};

type CalendarDay = {
  day: string;
  iso?: string;
  faded?: boolean;
};

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Tổng quan" },
  { icon: Blocks, label: "Nghệ nhân" },
  { icon: CalendarDays, label: "Bộ sưu tập" },
  { icon: ShoppingCart, label: "Đơn hàng", badge: "12" },
  { icon: Package, label: "Kho vật liệu", badge: "3" },
  { icon: SquareChartGantt, label: "Phân tích" },
  { icon: Users, label: "Người dùng", badge: "5" },
  { icon: Cog, label: "Cài đặt" },
];

const notificationsSeed: NotificationItem[] = [
  {
    id: "n1",
    title: "Sắp vào buổi",
    detail: "Workshop dệt lụa còn 18 phút nữa sẽ bắt đầu.",
    tone: "amber",
  },
  {
    id: "n2",
    title: "Nghệ nhân đã đến",
    detail: "Nghệ nhân Trần Văn Chương đã có mặt tại Xưởng A.",
    tone: "green",
  },
  {
    id: "n3",
    title: "Cần đổi phòng",
    detail: "Workshop gom chuyền sang Khu khác vì số người tăng.",
    tone: "red",
  },
];

const workshopSeed: WorkshopItem[] = [
  {
    id: "ws-01",
    title: "Lớp dệt lụa thủ công",
    artisan: "Nghệ nhân Trần Văn Chương",
    supporter: "Người hỗ trợ Nguyễn Minh Thư",
    location: "Xưởng A",
    date: "2026-06-28",
    startTime: "09:30",
    endTime: "11:30",
    attendees: 8,
    capacity: 12,
    category: "Det",
    status: "hoan-tat",
  },
  {
    id: "ws-02",
    title: "Workshop tráng men gốm",
    artisan: "Nghệ nhân Lê Thị Nga",
    supporter: "Người hỗ trợ Trần Bảo Anh",
    location: "Khu Bắc",
    date: "2026-06-28",
    startTime: "13:00",
    endTime: "15:30",
    attendees: 15,
    capacity: 20,
    category: "Gom",
    status: "sap-toi",
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
    attendees: 6,
    capacity: 10,
    category: "Thu phap",
    status: "sap-toi",
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
    attendees: 10,
    capacity: 16,
    category: "Son mai",
    status: "sap-toi",
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
    attendees: 18,
    capacity: 18,
    category: "Giay",
    status: "sap-toi",
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
    attendees: 9,
    capacity: 14,
    category: "Kinh mau",
    status: "sap-toi",
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
    attendees: 11,
    capacity: 16,
    category: "Nhuom",
    status: "sap-toi",
  },
];

const statusClasses: Record<WorkshopStatus, string> = {
  "dang-dien-ra": "bg-[#e4f0dd] text-[#567648] border-[#b9d1a9]",
  "sap-toi": "bg-[#f7ead8] text-[#9a652d] border-[#e6c8a6]",
  "hoan-tat": "bg-[#ece3d7] text-[#7c5e42] border-[#dbc6ae]",
  "da-huy": "bg-[#f9e3de] text-[#b55243] border-[#e6b3ab]",
};

const notificationToneClasses = {
  green: "bg-[#e4f0dd] text-[#567648]",
  amber: "bg-[#f7ead8] text-[#9a652d]",
  red: "bg-[#f9e3de] text-[#b55243]",
} as const;

const hourLabels = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const calendarDays: CalendarDay[] = [
  { day: "23", faded: true },
  { day: "24", faded: true },
  { day: "25", faded: true },
  { day: "26", faded: true },
  { day: "27", faded: true },
  { day: "28", iso: "2026-06-28" },
  { day: "29", iso: "2026-06-29" },
  { day: "30", iso: "2026-06-30" },
  { day: "01", iso: "2026-07-01" },
  { day: "02", iso: "2026-07-02" },
  { day: "03", iso: "2026-07-03" },
  { day: "04", iso: "2026-07-04" },
  { day: "05", iso: "2026-07-05" },
  { day: "06", iso: "2026-07-06" },
];

function timeToHour(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour + minute / 60;
}

function hourToPercent(hour: number) {
  const start = 8;
  const total = 10;
  return ((hour - start) / total) * 100;
}

function statusText(status: WorkshopStatus) {
  if (status === "dang-dien-ra") return "Dang dien ra";
  if (status === "sap-toi") return "Sap toi";
  if (status === "hoan-tat") return "Hoan tat";
  return "Da huy";
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

function formatClock(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function AdminPanel() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Tat ca");
  const [categoryFilter, setCategoryFilter] = useState("Tat ca");
  const [selectedDate, setSelectedDate] = useState("2026-06-28");
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(workshopSeed);
  const [now, setNow] = useState(() => new Date("2026-06-28T12:18:00"));
  const [openedActions, setOpenedActions] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow((current) => new Date(current.getTime() + 60000));
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const selectedDayWorkshops = useMemo(
    () => workshops.filter((item) => item.date === selectedDate),
    [selectedDate, workshops],
  );

  const filteredWorkshops = useMemo(() => {
    return workshops.filter((item) => {
      const matchesSearch = [
        item.title,
        item.artisan,
        item.location,
        item.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLocation =
        locationFilter === "Tat ca" || item.location === locationFilter;
      const matchesCategory =
        categoryFilter === "Tat ca" || item.category === categoryFilter;

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [categoryFilter, locationFilter, search, workshops]);

  const uniqueLocations = [
    "Tat ca",
    ...new Set(workshops.map((item) => item.location)),
  ];
  const uniqueCategories = [
    "Tat ca",
    ...new Set(workshops.map((item) => item.category)),
  ];

  const nowHour = now.getHours() + now.getMinutes() / 60;
  const todayCards = selectedDayWorkshops.slice(0, 2);

  const kpis = [
    {
      label: "Workshop trong ngày",
      value: String(selectedDayWorkshops.length),
      subtext: `${selectedDayWorkshops.filter((item) => item.status === "sap-toi").length} lich sap dien ra`,
      tone: "green" as const,
    },
    {
      label: "Người tham dự",
      value: String(
        selectedDayWorkshops.reduce((sum, item) => sum + item.attendees, 0),
      ),
      tone: "brown" as const,
    },
    {
      label: "Ghế trống",
      value: String(
        selectedDayWorkshops.reduce(
          (sum, item) => sum + Math.max(item.capacity - item.attendees, 0),
          0,
        ),
      ),
      subtext: `${selectedDayWorkshops.filter((item) => item.attendees >= item.capacity).length} lich da day`,
      tone: "amber" as const,
    },
    {
      label: "Tiến độ hoàn tất",
      value: `${
        selectedDayWorkshops.length === 0
          ? 0
          : Math.round(
              (selectedDayWorkshops.filter((item) => item.status === "hoan-tat").length /
                selectedDayWorkshops.length) *
                100,
            )
      }%`,
      subtext: `${selectedDayWorkshops.filter((item) => item.status === "hoan-tat").length}/${selectedDayWorkshops.length} Lich da xong`,
      tone: "red" as const,
    },
  ];

  return (
    <div className="admin-shell min-h-svh">
      <div className="grid min-h-svh lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[color:var(--color-admin-border)] bg-[#fbf4ec] lg:flex lg:flex-col">
          <div className="px-8 py-10">
            <h1 className="text-2xl font-semibold text-[color:var(--color-admin-text)]">
              Trang của quản trị viên
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-admin-muted)]">
              Bảng điều khiển
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {sidebarItems.map(({ icon: Icon, label, active, badge }) => (
              <button
                key={label}
                type="button"
                className={[
                  "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors",
                  active
                    ? "border-l-4 border-[color:var(--color-admin-accent)] bg-[#f4e7da] text-[color:var(--color-admin-accent)]"
                    : "text-[color:var(--color-admin-text)] hover:bg-[#f5ebe0]",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </span>
                {badge ? (
                  <span className="rounded-full bg-[#efe1d2] px-2 py-0.5 text-xs font-semibold text-[color:var(--color-admin-accent)]">
                    {badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <main className="px-4 py-4 md:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface)] px-4 py-3 md:w-[520px]">
                <Search className="h-4 w-4 text-[color:var(--color-admin-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-sm text-[color:var(--color-admin-text)] outline-none placeholder:text-[color:var(--color-admin-muted)]"
                  placeholder="Tim workshop, nghe nhan hoac dia diem..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((open) => !open)}
                    className="relative rounded-full border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface)] p-3 text-[color:var(--color-admin-text)]"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[color:var(--color-admin-danger)]" />
                  </button>

                  {notificationsOpen ? (
                    <div className="absolute right-0 z-20 mt-3 w-80 rounded-3xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] p-4 shadow-[0_18px_40px_rgba(95,61,31,0.12)]">
                      <p className="text-sm font-semibold text-[color:var(--color-admin-text)]">
                        Thông báo mới
                      </p>
                      <div className="mt-3 space-y-3">
                        {notificationsSeed.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-[color:var(--color-admin-border)] p-3"
                          >
                            <span
                              className={[
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                notificationToneClasses[item.tone],
                              ].join(" ")}
                            >
                              {item.title}
                            </span>
                            <p className="mt-2 text-sm text-[color:var(--color-admin-muted)]">
                              {item.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="rounded-full border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface)] p-3 text-[color:var(--color-admin-text)]"
                >
                  <UserRound className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  className="rounded-2xl bg-[color:var(--color-admin-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(138,84,31,0.22)]"
                >
                  + Tạo lịch mới
                </button>
              </div>
            </header>

            <section className="flex flex-col gap-2">
              <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--color-admin-text)]">
                Lịch workshop
              </h2>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((item) => (
                <article key={item.label} className="admin-card rounded-3xl p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "rounded-2xl p-3",
                        item.tone === "green"
                          ? "bg-[#e4efe1] text-[#5f7f55]"
                          : item.tone === "amber"
                            ? "bg-[#f6e5d1] text-[#c28a3d]"
                            : item.tone === "brown"
                              ? "bg-[#eee2d6] text-[#8a541f]"
                              : "bg-[#f9e3de] text-[#c75543]",
                      ].join(" ")}
                    >
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-admin-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-4xl font-semibold text-[color:var(--color-admin-text)]">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-[color:var(--color-admin-muted)]">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="admin-card rounded-[30px] p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-[color:var(--color-admin-text)]">
                    Lịch trong ngày
                  </h3>
                </div>
                <div className="rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] px-4 py-3 text-sm text-[color:var(--color-admin-text)]">
                  Ngày: <span className="font-semibold">{formatDateLabel(selectedDate)}</span> •
                  Giờ <span className="font-semibold">{formatClock(now)}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="relative min-w-[920px] rounded-3xl bg-[#fffdf9] px-4 py-5">
                  <div className="grid grid-cols-11 gap-2 border-b border-[color:var(--color-admin-border)] pb-4 text-sm font-medium text-[color:var(--color-admin-muted)]">
                    {hourLabels.map((hour) => (
                      <div key={hour} className="text-center">
                        {hour}
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-6 h-56">
                    {selectedDate === "2026-06-28" ? (
                      <div
                        className="absolute bottom-0 top-0 w-px bg-[color:var(--color-admin-danger)]"
                        style={{ left: `${hourToPercent(nowHour)}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-[color:var(--color-admin-danger)]">
                          *
                        </span>
                        <span className="absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[color:var(--color-admin-danger)]" />
                      </div>
                    ) : null}

                    {selectedDayWorkshops.map((item, index) => {
                      const startHour = timeToHour(item.startTime);
                      const endHour = timeToHour(item.endTime);
                      const widthHours = endHour - startHour;

                      return (
                        <div
                          key={item.id}
                          className={[
                            "absolute rounded-2xl border-l-4 px-4 py-3 shadow-sm",
                            item.status === "dang-dien-ra"
                              ? "border-[#5f7f55] bg-[#e9efe7]"
                              : item.status === "hoan-tat"
                                ? "border-[#8a541f] bg-[#f2e6d9]"
                                : item.status === "da-huy"
                                  ? "border-[#c75543] bg-[#f9e3de]"
                                  : "border-[#c28a3d] bg-[#fbecdf]",
                          ].join(" ")}
                          style={{
                            left: `${hourToPercent(startHour)}%`,
                            top: `${24 + index * 62}px`,
                            width: `${(widthHours / 10) * 100}%`,
                          }}
                        >
                          <p className="text-sm font-semibold text-[color:var(--color-admin-text)]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-[color:var(--color-admin-muted)]">
                            {item.startTime} - {item.endTime} • {item.location}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="admin-card rounded-[30px] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[color:var(--color-admin-text)]">
                    Lịch trình hôm nay
                  </h3>
                  <button
                    type="button"
                    className="text-sm font-semibold text-[color:var(--color-admin-accent)]"
                    onClick={() =>
                      setWorkshops((current) =>
                        current.map((item) =>
                          item.id === "ws-02"
                            ? { ...item, attendees: item.attendees + 1 }
                            : item,
                        ),
                      )
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {todayCards.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-[color:var(--color-admin-border)] bg-[#fffdf9] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={[
                            "rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                            item.status === "dang-dien-ra"
                              ? "bg-[#e4f0dd] text-[#567648]"
                              : item.status === "hoan-tat"
                                ? "bg-[#ece3d7] text-[#7c5e42]"
                                : item.status === "da-huy"
                                  ? "bg-[#f9e3de] text-[#b55243]"
                                  : "bg-[#f7ead8] text-[#9a652d]",
                          ].join(" ")}
                        >
                          {statusText(item.status)}
                        </span>
                        <span className="text-sm font-semibold text-[color:var(--color-admin-text)]">
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>

                      <h4 className="mt-5 text-2xl font-semibold leading-tight text-[color:var(--color-admin-text)]">
                        {item.title}
                      </h4>
                      <div className="mt-2 text-sm text-[color:var(--color-admin-muted)]">
                        <p>{item.artisan}</p>
                        <p>{item.supporter}</p>
                        <p>{item.location}</p>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <span
                              key={`${item.id}-${index}`}
                              className="h-8 w-8 rounded-full border-2 border-[#fffdf9]"
                              style={{
                                backgroundColor:
                                  index === 3
                                    ? "#9d6a31"
                                    : ["#d9e2ec", "#cbd6e2", "#c2d1de"][index],
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-[color:var(--color-admin-text)]">
                          Sức chứa: {item.attendees}/{item.capacity}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="admin-card rounded-[30px] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[color:var(--color-admin-text)]">
                    Lịch theo ngày
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--color-admin-border)] p-2 text-[color:var(--color-admin-muted)]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--color-admin-border)] p-2 text-[color:var(--color-admin-muted)]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-7 gap-y-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-admin-muted)]">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                  {calendarDays.map((day) => {
                    const count = day.iso
                      ? workshops.filter((item) => item.date === day.iso).length
                      : 0;
                    const isSelected = day.iso === selectedDate;

                    return (
                      <button
                        key={`${day.day}-${day.iso ?? "faded"}`}
                        type="button"
                        disabled={!day.iso}
                        onClick={() => day.iso && setSelectedDate(day.iso)}
                        className="flex flex-col items-center gap-1 disabled:cursor-default"
                      >
                        <span
                          className={[
                            "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium",
                            isSelected
                              ? "bg-[color:var(--color-admin-accent)] text-white"
                              : day.faded
                                ? "text-[#c9b4a0]"
                                : "text-[color:var(--color-admin-text)]",
                          ].join(" ")}
                        >
                          {day.day}
                        </span>
                        <span className="min-h-[6px]">
                          {count > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
                                <span
                                  key={`${day.day}-${index}`}
                                  className={[
                                    "h-1.5 w-1.5 rounded-full",
                                    index === 0
                                      ? "bg-[#5f7f55]"
                                      : index === 1
                                        ? "bg-[#c28a3d]"
                                        : "bg-[#c75543]",
                                  ].join(" ")}
                                />
                              ))}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-[color:var(--color-admin-border)] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-admin-muted)]">
                    Lịch đã chọn
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedDayWorkshops.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-[#fffdf9] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-10 w-1 rounded-full bg-[#5f7f55]" />
                          <div>
                            <p className="font-medium text-[color:var(--color-admin-text)]">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm text-[color:var(--color-admin-muted)]">
                              {item.startTime} • {item.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>

            <section className="admin-card rounded-[30px] p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-2xl font-semibold text-[color:var(--color-admin-text)]">
                    Danh sách workshop
                  </h3>
                  <button
                    type="button"
                    className="self-start rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-admin-text)] md:self-auto"
                  >
                    Xuất dữ liệu
                  </button>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] px-4 py-3 xl:w-[420px]">
                    <Search className="h-4 w-4 text-[color:var(--color-admin-muted)]" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--color-admin-muted)]"
                      placeholder="Tim workshop..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={locationFilter}
                      onChange={(event) => setLocationFilter(event.target.value)}
                      className="rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] px-4 py-3 text-sm text-[color:var(--color-admin-text)]"
                    >
                      {uniqueLocations.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      className="rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] px-4 py-3 text-sm text-[color:var(--color-admin-text)]"
                    >
                      {uniqueCategories.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[980px] overflow-hidden rounded-[24px] border border-[color:var(--color-admin-border)]">
                  <div className="grid grid-cols-[2.3fr_1.6fr_1.5fr_1.5fr_1fr_92px] gap-4 bg-[#f8efe6] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-admin-muted)]">
                    <div>Tên workshop</div>
                    <div>Nghệ nhân</div>
                    <div>Ngày giờ</div>
                    <div>Địa điểm</div>
                    <div>Trạng thái</div>
                    <div>Thao tác</div>
                  </div>

                  {filteredWorkshops.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[2.3fr_1.6fr_1.5fr_1.5fr_1fr_92px] gap-4 border-t border-[color:var(--color-admin-border)] bg-[#fffdf9] px-6 py-4 text-sm text-[color:var(--color-admin-text)]"
                    >
                      <div className="font-medium leading-6">{row.title}</div>
                      <div className="leading-6">
                        <p>{row.artisan}</p>
                        <p className="text-xs text-[color:var(--color-admin-muted)]">
                          {row.supporter}
                        </p>
                      </div>
                      <div className="leading-6">
                        {formatDateLabel(row.date)} • {row.startTime} - {row.endTime}
                      </div>
                      <div className="leading-6">{row.location}</div>
                      <div>
                        <span
                          className={[
                            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                            statusClasses[row.status],
                          ].join(" ")}
                        >
                          {statusText(row.status)}
                        </span>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenedActions((current) =>
                              current === row.id ? null : row.id,
                            )
                          }
                          className="rounded-full p-2 text-[color:var(--color-admin-muted)] hover:bg-[#f4e7da]"
                        >
                          <CircleEllipsis className="h-5 w-5" />
                        </button>

                        {openedActions === row.id ? (
                          <div className="absolute right-0 z-10 mt-2 w-36 rounded-2xl border border-[color:var(--color-admin-border)] bg-[#fffdf9] p-2 shadow-[0_18px_40px_rgba(95,61,31,0.12)]">
                            <button
                              type="button"
                              onClick={() =>
                                setWorkshops((current) =>
                                  current.map((item) =>
                                    item.id === row.id
                                      ? { ...item, status: "hoan-tat" }
                                      : item,
                                  ),
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f5ebe0]"
                            >
                              <Check className="h-4 w-4" />
                              Hoàn tất
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWorkshops((current) =>
                                  current.map((item) =>
                                    item.id === row.id
                                      ? { ...item, status: "da-huy" }
                                      : item,
                                  ),
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f5ebe0]"
                            >
                              <X className="h-4 w-4" />
                              Hủy lịch
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
