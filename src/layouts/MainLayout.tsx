import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";
import { NavItem } from "@/components/NavItem";
import { ContactButton } from "@/components/ContactButton";
import { Logo } from "@/components/Logo";

const leftNav = [
  { to: "/", label: "Trang Chủ", end: true },
  { to: "/about", label: "Giới Thiệu" },
  { to: "/phuc-loi", label: "Phúc Lợi" },
  { to: "/gallery", label: "Trưng Bày" },
  { to: "/tri-thuc", label: "Tri Thức" },
] as const;

export function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide the header when scrolling down, reveal it when scrolling back up.
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;
    const direction = current - previous;
    // Ignore micro-scroll; only hide once past the header height.
    if (direction > 6 && current > 100) setHidden(true);
    else if (direction < -6) setHidden(false);
  });

  // Lock body scroll + allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const headerHidden = hidden && !menuOpen;

  return (
    <div className="flex min-h-svh flex-col bg-ink text-white">
      <motion.header
        animate={{ y: headerHidden ? "-130%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md"
      >
        <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
          <div className="flex items-center gap-4">
            <Hamburger
              open={menuOpen}
              onToggle={() => setMenuOpen((o) => !o)}
            />
            <nav className="hidden items-center gap-6 md:flex">
              {leftNav.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
          </div>

          <Logo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="flex items-center gap-3">
            <HeaderNotifications />
            <ContactButton />
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="w-full flex-1 flex flex-col">
        <AnimatedOutlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-center px-4 text-[0.7rem] tracking-[0.3em] text-white/40 md:px-6">
          © {new Date().getFullYear()} CHẠM CỘI. All rights reserved.   | Team R Grab The Hackathon 2026
        </div>
      </footer>
    </div>
  );
}

function Hamburger({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="toggle menu"
      aria-expanded={open}
      className="relative flex h-10 w-10 items-center justify-center md:hidden"
    >
      <span
        className={`absolute h-px w-6 bg-white transition-all duration-300 ${
          open ? "rotate-45" : "-translate-y-[5px]"
        }`}
      />
      <span
        className={`absolute h-px w-6 bg-white transition-all duration-300 ${
          open ? "-rotate-45" : "translate-y-[5px]"
        }`}
      />
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink md:hidden"
        >
          {leftNav.map((item) => (
            <NavItem key={item.to} {...item} large onNavigate={onClose} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const saved = JSON.parse(localStorage.getItem("user-notifications") || "[]");
    
    // Seed notifications for visual content
    const seeds = [
      {
        id: "seed-1",
        title: "Sắp diễn ra",
        detail: "Lớp dệt lụa thủ công sắp khai giảng trong 2 ngày tới.",
        tone: "amber" as const,
      },
      {
        id: "seed-2",
        title: "Nghệ nhân xác nhận",
        detail: "Nghệ nhân Lê Thị Nga đã có mặt tại Khu Bắc chuẩn bị cho lớp gốm.",
        tone: "green" as const,
      },
    ];
    
    setNotifications([...saved, ...seeds]);
  };

  useEffect(() => {
    loadNotifications();

    const saved = JSON.parse(localStorage.getItem("user-notifications") || "[]");
    setUnreadCount(saved.length);

    const handleUpdate = () => {
      loadNotifications();
      const currentSaved = JSON.parse(localStorage.getItem("user-notifications") || "[]");
      setUnreadCount(currentSaved.length);
    };

    window.addEventListener("user-notifications-updated", handleUpdate);
    return () => {
      window.removeEventListener("user-notifications-updated", handleUpdate);
    };
  }, []);

  const handleOpenToggle = () => {
    setOpen((o) => !o);
    if (!open) {
      setUnreadCount(0); // Reset unread bubble on open
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem("user-notifications");
    window.dispatchEvent(new CustomEvent("user-notifications-cleared"));
    window.dispatchEvent(new CustomEvent("user-notifications-updated"));
  };

  const toneClasses = {
    green: "bg-[#e4f0dd]/10 text-[#a3c993] border-[#567648]/20",
    amber: "bg-[#f7ead8]/10 text-[#d8af75] border-[#9a652d]/20",
    red: "bg-[#f9e3de]/10 text-[#e09185] border-[#b55243]/20",
  } as const;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpenToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white transition-all cursor-pointer"
        aria-label="Xem thông báo"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop click overlay */}
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-white/10 bg-[#0c0c0e]/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.7)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-300">
                  Thông báo trải nghiệm
                </span>
                {notifications.some(n => !n.id.startsWith("seed-")) && (
                  <button
                    onClick={handleClearAll}
                    className="text-[9px] uppercase tracking-wider text-amber-200/60 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    Xóa đăng ký
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
                          toneClasses[item.tone as keyof typeof toneClasses] || toneClasses.green
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-stone-400 font-light">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
