"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

export function PageProgress() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);

  useEffect(() => {
    setRun((current) => current + 1);
  }, [pathname]);

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      key={run}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.2, times: [0, 0.75, 1] }}
    >
      <motion.div
        className="h-full origin-left bg-brand-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.span
        className="absolute -top-2 left-0 text-brand-600"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: [0, 60, 120], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <Coins aria-hidden="true" size={12} />
      </motion.span>
    </motion.div>
  );
}
