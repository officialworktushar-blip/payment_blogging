"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-brand-600"
      style={{ scaleX }}
    />
  );
}
