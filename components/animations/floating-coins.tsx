"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const COINS: {
  symbol: string;
  left: string;
  top: string;
  delay: number;
  near: boolean;
  size: string;
}[] = [
  { symbol: "₹", left: "5%", top: "22%", delay: 0, near: false, size: "text-3xl" },
  { symbol: "$", left: "15%", top: "74%", delay: 0.9, near: true, size: "text-2xl" },
  { symbol: "€", left: "86%", top: "18%", delay: 0.4, near: true, size: "text-2xl" },
  { symbol: "£", left: "92%", top: "68%", delay: 1.3, near: false, size: "text-3xl" },
  { symbol: "₹", left: "76%", top: "86%", delay: 0.6, near: false, size: "text-xl" },
];

export function FloatingCoins() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const farY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -95]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {COINS.map((coin) => (
        <motion.div
          key={`${coin.symbol}-${coin.left}`}
          className="absolute"
          style={{ left: coin.left, top: coin.top, y: coin.near ? nearY : farY }}
        >
          <motion.span
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 font-semibold text-brand-200 backdrop-blur-sm ${coin.size}`}
            animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
            transition={{
              duration: 6,
              delay: coin.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {coin.symbol}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
