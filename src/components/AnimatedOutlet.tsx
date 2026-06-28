import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet } from "react-router-dom";

/**
 * Wraps the route outlet in a keyed AnimatePresence so each navigation
 * fades + lifts in and the previous page lifts out.
 *
 * `useOutlet()` is captured per-render, so the exiting node keeps its
 * own content snapshot during the exit animation (required for data routers).
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
