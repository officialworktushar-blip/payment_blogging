"use client";

import { motion, useReducedMotion } from "motion/react";
import { Wifi } from "lucide-react";

export function FlipCard() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="group [perspective:1200px]">
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto h-52 w-full max-w-sm"
      >
        <div className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:[transform:rotateY(180deg)] motion-reduce:group-hover:[transform:none]">
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 via-navy-900 to-brand-900 p-5 text-white shadow-lift [backface-visibility:hidden]">
            <div className="flex items-start justify-between">
              <span className="grid grid-cols-2 gap-0.5 rounded-md bg-amber-200/80 p-1.5">
                {[0, 1, 2, 3, 4, 5].map((cell) => (
                  <span key={cell} className="h-1.5 w-2.5 rounded-[1px] bg-amber-600/60" />
                ))}
              </span>
              <Wifi aria-hidden="true" size={22} className="rotate-90 text-white/80" />
            </div>

            <div>
              <p className="font-mono text-lg tracking-[0.18em] sm:text-xl">4111 xxxx xxxx 1111</p>
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
                <span>Demo card</span>
                <span>MM/YY</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-800 to-navy-900 p-5 text-white shadow-lift [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="-mx-5 mt-3 h-10 bg-navy-950" />
            <div className="flex items-center justify-end">
              <span className="rounded bg-white/85 px-3 py-1.5 font-mono text-xs tracking-widest text-navy-900">
                xxx
              </span>
            </div>
            <p className="text-[10px] uppercase leading-4 tracking-wide text-white/60">
              Fictional sample. No real card or CVV is shown.
            </p>
          </div>
        </div>
      </motion.div>
      <p className="mt-4 text-center text-xs text-slate-500">Hover to flip the demo card</p>
    </div>
  );
}
