import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";
import { BracketLink } from "@/components/BracketLink";
import { ContactButton } from "@/components/ContactButton";
import { Logo } from "@/components/Logo";

const leftNav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
] as const;

export function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="flex min-h-svh flex-col bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
          <div className="flex items-center gap-4">
            <Hamburger
              open={menuOpen}
              onToggle={() => setMenuOpen((o) => !o)}
            />
            <nav className="hidden items-center gap-6 md:flex">
              {leftNav.map((item) => (
                <BracketLink key={item.to} {...item} />
              ))}
            </nav>
          </div>

          <Logo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

          <ContactButton />
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <AnimatedOutlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-center px-4 text-[0.7rem] tracking-[0.3em] text-white/40 md:px-6">
          © {new Date().getFullYear()} CHẠM CÕI
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
            <BracketLink key={item.to} {...item} large onNavigate={onClose} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
