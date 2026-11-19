"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Shield } from "lucide-react";
import { useRef } from "react";

export function SecurityShield() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const active = inView || Boolean(reduceMotion);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-brand-300"
          animate={
            active && !reduceMotion
              ? { scale: [1, 1.2, 1], opacity: [0.55, 0, 0.55] }
              : { scale: 1, opacity: 0.35 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 2.4, repeat: Infinity, ease: "easeOut" }
          }
        />
        <Shield aria-hidden="true" size={72} strokeWidth={1.4} className="text-brand-600" fill="#eef2ff" />
        <svg viewBox="0 0 40 40" className="absolute h-10 w-10" aria-hidden="true">
          <rect x={9} y={18} width={22} height={15} rx={3} fill="#4f46e5" />
          <motion.path
            d="M14 18 v-4 a6 6 0 0 1 12 0 v4"
            fill="none"
            stroke="#17233d"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
          />
        </svg>
      </div>
      <h3 className="mt-5 font-serif text-xl font-semibold text-navy-900">Security at every step</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
        Encryption, tokenisation and verification work together. Your OTP, PIN and CVV stay private
        always.
      </p>
    </div>
  );
}
