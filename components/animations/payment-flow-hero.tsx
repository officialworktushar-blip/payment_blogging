"use client";

import { motion, useReducedMotion } from "motion/react";
import { Landmark, ShieldCheck, Smartphone, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NODES: { label: string; x: number; y: number; icon: LucideIcon }[] = [
  { label: "Customer", x: 70, y: 130, icon: Smartphone },
  { label: "Gateway", x: 260, y: 65, icon: ShieldCheck },
  { label: "Bank", x: 450, y: 130, icon: Landmark },
  { label: "Merchant", x: 640, y: 65, icon: Store },
];

const DOT_DELAYS = [0, 0.75, 1.5];

export function PaymentFlowHero() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full">
      <div role="img" aria-label="A payment travelling from customer through gateway and bank to merchant, ending with a success check">
        <svg viewBox="0 0 700 230" className="h-auto w-full">
          <path
            d="M70 130 C150 130 180 65 260 65 C340 65 370 130 450 130 C530 130 560 65 640 65"
            fill="none"
            stroke="#7389ba"
            strokeWidth={2}
            strokeDasharray="5 9"
            strokeLinecap="round"
            opacity={0.75}
          />

          {DOT_DELAYS.map((delay, index) => (
            <motion.g
              key={delay}
              initial={reduceMotion ? false : { x: 70, y: 130, opacity: 0 }}
              animate={
                reduceMotion
                  ? { x: 450, y: 130, opacity: 0 }
                  : {
                      x: [70, 260, 450, 640],
                      y: [130, 65, 130, 65],
                      opacity: [0, 1, 1, 0],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 6.4,
                      delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.34, 0.68, 1],
                    }
              }
            >
              <circle r={index === 0 ? 8 : 6} fill="#818cf8" opacity={0.25} />
              <circle r={3.5} fill="#c7d2fe" />
            </motion.g>
          ))}

          {NODES.map((node) => {
            const Icon = node.icon;
            return (
              <g key={node.label}>
                <circle cx={node.x} cy={node.y} r={26} fill="#17233d" stroke="#6366f1" strokeWidth={1.5} />
                <Icon
                  x={node.x - 10}
                  y={node.y - 10}
                  width={20}
                  height={20}
                  color="#c7d2fe"
                  aria-hidden="true"
                />
                <text
                  x={node.x}
                  y={node.y + 44}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#cbd5e1"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          <motion.path
            d="M631 65 l6 6 l13 -15"
            fill="none"
            stroke="#16a34a"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 6.4,
                    repeat: Infinity,
                    ease: "easeOut",
                    times: [0, 0.7, 0.78, 0.94, 1],
                  }
            }
          />
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-300">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Encrypted request</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Authorised</span>
        <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-emerald-300">
          Settled
        </span>
      </div>
    </div>
  );
}
