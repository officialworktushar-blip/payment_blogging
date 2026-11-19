"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const PATTERN: number[][] = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
];

export function QRScan() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <div className="grid h-40 w-40 grid-cols-9 gap-0.5 rounded-xl border border-slate-200 bg-white p-2 shadow-card">
          {PATTERN.flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={`rounded-[2px] ${cell === 1 ? "bg-navy-900" : "bg-transparent"}`}
              />
            )),
          )}
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 top-2 h-0.5 rounded-full bg-success shadow-[0_0_12px_rgba(22,163,74,0.75)]"
          initial={reduceMotion ? false : { y: 0, opacity: 0.4 }}
          animate={reduceMotion ? { y: 80, opacity: 0 } : { y: [0, 160, 0], opacity: [0.4, 1, 0.4] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>

      <motion.div
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-success-dark"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: [0, 0, 1, 1, 0], scale: [0.9, 0.9, 1, 1, 0.95] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 3.4,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.62, 0.72, 0.94, 1],
              }
        }
      >
        <CheckCircle2 aria-hidden="true" size={15} />
        Payment successful
      </motion.div>
      <p className="mt-2 text-center text-[11px] text-slate-500">Demo QR pattern — not scannable</p>
    </div>
  );
}
