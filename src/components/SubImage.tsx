import { motion } from "motion/react";

type SubImageProps = {
  src: string;
  alt: string;
  /** Whether this tile is currently the hovered one (drives grayscale). */
  isActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  className?: string;
};

/**
 * A sub image that lives in grayscale and "wakes up" to full colour + a gentle
 * spring scale when hovered. Colour is driven through a CSS filter transition
 * (isActive), scale through Framer Motion's whileHover.
 */
export function SubImage({
  src,
  alt,
  isActive,
  onHoverStart,
  onHoverEnd,
  className = "",
}: SubImageProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={[
        "object-cover transition-[filter] duration-700 ease-out select-none",
        isActive ? "grayscale-0" : "grayscale",
        className,
      ].join(" ")}
    />
  );
}
